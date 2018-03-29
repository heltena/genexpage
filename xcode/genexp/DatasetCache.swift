//
//  DatasetCache.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/28/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

typealias DatasetVersion = (number: String, timestamp: String)

class Dataset {
    let geneList: [Gene]
    let geneListBy: [GeneSelection: [Gene]]
    let pfuList: [Pfu]
    let tissueList: [Tissue]
    
    init(geneList: [Gene], geneListBy: [GeneSelection: [Gene]], pfuList: [Pfu], tissueList: [Tissue]) {
        self.geneList = geneList
        self.geneListBy = geneListBy
        self.pfuList = pfuList
        self.tissueList = tissueList
    }
}

class DatasetCache {
    
    init() {
    }
    
    func loadDataFromServer(completion: @escaping (Dataset?) -> Void) {
        var geneList: [Gene]?
        var geneListBy: [GeneSelection: [Gene]]?
        var pfuList: [Pfu]?
        var tissueList: [Tissue]?
        
        let group = DispatchGroup()
        group.enter()
        Server.main.geneList { list in
            geneList = list
            if let geneList = geneList {
                geneListBy = [
                    .symbol: DataManager.sorted(geneList: geneList.filter { $0.symbol != nil }, by: .symbol),
                    .entrez: DataManager.sorted(geneList: geneList.filter { $0.gene != nil }, by: .entrez),
                    .ensembl: DataManager.sorted(geneList: geneList, by: .ensembl)
                ]
            }
            group.leave()
        }
        
        group.enter()
        Server.main.pfuList { list in
            pfuList = list
            group.leave()
        }
        
        group.enter()
        Server.main.tissueList { list in
            tissueList = list
            group.leave()
        }
        
        group.notify(queue: .main) {
            if let geneList = geneList,
                let geneListBy = geneListBy,
                let pfuList = pfuList,
                let tissueList = tissueList {
                let dataset = Dataset(geneList: geneList, geneListBy: geneListBy, pfuList: pfuList, tissueList: tissueList)
                completion(dataset)
            } else {
                completion(nil)
            }
        }
    }

    func readData(completion: @escaping (Dataset?) -> Void) {
        var cacheVersion: DatasetVersion?
        var dataset: Dataset?
        let datasetVersionURL = try? FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: false).appendingPathComponent("dataset_cache.json")
        
        if let datasetVersionURL = datasetVersionURL,
            let data = try? Data(contentsOf: datasetVersionURL),
            let json = try? JSONSerialization.jsonObject(with: data, options: []),
            let result = json as? [String: Any],
            let version = result["version"] as? [String], version.count == 2,
            
            let geneListJson = result["genes"] as? [[Any?]],
            let genesBySymbolJson = result["genesBySymbol"] as? [[Any?]],
            let genesByEntrezJson = result["genesByEntrez"] as? [[Any?]],
            let genesByEnsemblJson = result["genesByEnsembl"] as? [[Any?]],
            let tissueListJson = result["tissues"] as? [String],
            let pfuListJson = result["pfus"] as? [String]
        {
            let geneList = geneListJson.flatMap { Gene(from: $0) }
            let genesBySymbol = genesBySymbolJson.flatMap { Gene(from: $0) }
            let genesByEntrez = genesByEntrezJson.flatMap { Gene(from: $0) }
            let genesByEnsembl = genesByEnsemblJson.flatMap { Gene(from: $0) }
            let geneListBy: [GeneSelection: [Gene]] = [
                .symbol: genesBySymbol,
                .entrez: genesByEntrez,
                .ensembl: genesByEnsembl]
            let tissueList = tissueListJson.flatMap { Tissue(from: $0) }
            let pfuList = pfuListJson.flatMap { Pfu(from: $0) }
            
            cacheVersion = DatasetVersion(number: version[0], timestamp: version[1])
            dataset = Dataset(geneList: geneList, geneListBy: geneListBy, pfuList: pfuList, tissueList: tissueList)
        }
        
        Server.main.datasetVersion { serverVersion in
            if let cacheVersion = cacheVersion,
                let serverVersion = serverVersion, cacheVersion == serverVersion,
                let dataset = dataset
            {
                completion(dataset)
            } else {
                self.loadDataFromServer { dataset in
                    if let serverVersion = serverVersion, let dataset = dataset {
                        let result: [String: Any] = [
                            "version": [serverVersion.number, serverVersion.timestamp],
                            "genes": dataset.geneList.map { $0.json },
                            "genesBySymbol": dataset.geneListBy[.symbol, default: []].map { $0.json },
                            "genesByEntrez": dataset.geneListBy[.entrez, default: []].map { $0.json },
                            "genesByEnsembl": dataset.geneListBy[.ensembl, default: []].map { $0.json },
                            "tissues": dataset.tissueList.map { $0.json },
                            "pfus": dataset.pfuList.map { $0.json }
                        ]
                        if let datasetVersionURL = datasetVersionURL,
                            let data = try? JSONSerialization.data(withJSONObject: result, options: []) {
                            try? data.write(to: datasetVersionURL)
                        }
                    }
                    completion(dataset)
                }
            }
        }
    }
    
}
