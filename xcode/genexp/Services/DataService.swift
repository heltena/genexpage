//
//  DataService.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/25/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation
import Combine

enum DataServiceError: Error {
    case decode(String)
}

enum LoadingState {
    case clean
    case loading
    case loaded
    case error
}

class DataService: ObservableObject {

    @Published private(set) var state: LoadingState = .clean
    @Published private(set) var genes: [Gene] = []
    @Published private(set) var genesBy: [GeneSelection: [Gene]] = [:]
    @Published private(set) var tissues: [Tissue] = []

    func loadData(useCache: Bool) {
        if state == .loading {
            return
        }

        state = .loading
        
        var cancellables: Set<AnyCancellable> = []
        let group = DispatchGroup()

        group.enter()
        readGenes(useCache: useCache)
            .sink(receiveCompletion: {
                if case .failure = $0 {
                    self.state = .error
                }
                group.leave()
            }) {
                self.genes = $0
                self.updateGeneListBySelection()
            }
            .store(in: &cancellables)

        group.enter()
        readTissues(useCache: useCache)
            .sink(receiveCompletion: {
                if case .failure = $0 {
                    self.state = .error
                }
                group.leave()
            }) {
                self.tissues = $0.sorted { $0.value < $1.value }
            }
            .store(in: &cancellables)
        
        group.notify(queue: .main) {
            cancellables.forEach { $0.cancel() }
            if self.state != .error {
                self.state = .loaded
            }
        }
    }
}

//MARK: - Base URL requests
extension DataService {

    private struct ServerError: Codable {
        let ok: Bool
        let message: String
    }

    private var baseUrl: URL? {
        var baseComponents = URLComponents()
        baseComponents.scheme = NSURLProtectionSpaceHTTPS
        baseComponents.host = "genexp.northwestern.edu"
        baseComponents.port = 443
        return baseComponents.url
    }

    private func request(path: String, method: String? = nil) -> URLRequest {
        let url = URL(string: path, relativeTo: baseUrl)!
        var request = URLRequest(url: url.absoluteURL)
        request.httpMethod = method
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        return request
    }

    private func request(path: String, postBody: [String: Any]) -> URLRequest {
        let url = URL(string: path, relativeTo: baseUrl)!
        var request = URLRequest(url: url.absoluteURL)

        request.httpBody = try? JSONSerialization.data(withJSONObject: postBody, options: [])
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        return request
    }
}

//MARK: - Cache
extension DataService {
    
    private func cacheUrl(for path: String) throws -> URL {
        let cacheFolderUrl = try FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        return URL(fileURLWithPath: path, relativeTo: cacheFolderUrl)
    }

    private func readCache<T: Codable>(for path: String, type: T.Type) -> T? {
        let decoder = JSONDecoder()
        guard
            let url = try? cacheUrl(for: path),
            let data = try? Data(contentsOf: url),
            let result = try? decoder.decode(type, from: data)
            else {
                return nil
        }
        return result
    }
    
    private func writeCache<T: Codable>(for path: String, value: T) {
        let encoder = JSONEncoder()
        if let url = try? cacheUrl(for: path),
            let data = try? encoder.encode(value)
        {
            try? data.write(to: url)
        }
    }
    
    fileprivate func read<T: Codable>(_ type: T.Type, api: String, cache path: String, useCache: Bool, convert: @escaping ((Data) throws -> T)) -> AnyPublisher<T, Error> {
        if useCache, let result = readCache(for: path, type: type) {
            return
                Just(result)
                    .setFailureType(to: Error.self)
                    .receive(on: DispatchQueue.main)
                    .eraseToAnyPublisher()
        }
        
        return
            URLSession.shared
                .dataTaskPublisher(for: request(path: api, method: "GET"))
                .tryMap { (data, response) in
                    guard let httpResponse = response as? HTTPURLResponse else {
                        throw DataServiceError.decode("Bad HTTP URL Response")
                    }

                    guard httpResponse.statusCode == 200 else {
                        throw DataServiceError.decode("Bad status code \(httpResponse.statusCode)")
                    }

                    let decoder = JSONDecoder()
                    if let serverError = try? decoder.decode(ServerError.self, from: data) {
                        let message = serverError.message
                        throw DataServiceError.decode(message)
                    }
                    
                    let result = try convert(data)
                    self.writeCache(for: path, value: result)
                    return result
                }
                .receive(on: DispatchQueue.main)
                .eraseToAnyPublisher()
    }

}

//MARK: - Query
extension DataService {
        
    func runQuery(selectedGenes: Set<Gene>, selectedTissues: Set<Tissue>, geneSelection: GeneSelection) -> AnyPublisher<AgeCountResult, Error> {
        var restrictions: [Any] = []
        
        let genes = selectedGenes.map { $0.ensembl }
        let tissues = selectedTissues.map { $0.value }
        
        var titleComponents: [String] = []
            
        if genes.count == 0 {
            return
                Fail<AgeCountResult, Error>(error: DataServiceError.decode("gene counts is empty"))
                    .receive(on: DispatchQueue.main)
                    .eraseToAnyPublisher()
        }
        
        titleComponents.append("{gene_names}")
        restrictions.append(["gene", "in", genes])

        if tissues.count > 0 {
            titleComponents.append("{tissue_names}")
            restrictions.append(["tissue", "in", tissues])
        }
            
        let title = titleComponents.joined(separator: ", ")
        
        let body: [String: Any] = [
            "dataset": "mouse_aging",
            "xaxis": "age",
            "series": "gene",
            "yAxisLabel": "Count",
            "geneIdentifier": geneSelection.asServerString,
            "restrictions": restrictions,
            "title": title]

        return
            URLSession.shared
                .dataTaskPublisher(for: request(path: "/api/agecounts", postBody: body))
                .tryMap { (data, response) in
                    guard let httpResponse = response as? HTTPURLResponse else {
                        throw DataServiceError.decode("Bad HTTP URL Response")
                    }

                    guard httpResponse.statusCode == 200 else {
                        throw DataServiceError.decode("Bad status code \(httpResponse.statusCode)")
                    }

                    let decoder = JSONDecoder()
                    if let serverError = try? decoder.decode(ServerError.self, from: data) {
                        let message = serverError.message
                        throw DataServiceError.decode(message)
                    }

                    return try decoder.decode(AgeCountResult.self, from: data)
                }
                .receive(on: DispatchQueue.main)
                .eraseToAnyPublisher()
    }
}

//MARK: - API requests
extension DataService {       

    fileprivate func updateGeneListBySelection() {
        // symbol
        if let geneBySymbol = readCache(for: "genes.by.symbol.cache.json", type: [Gene].self) {
            self.genesBy[.symbol] = geneBySymbol
        } else {
            let geneBySymbol = genes.sorted {
                guard let left = $0.symbol?.uppercased(), left.count > 0 else {
                    return false
                }
                guard let right = $1.symbol?.uppercased(), right.count > 0 else {
                    return true
                }
                let leftFirst = left.unicodeScalars.first!
                let rightFirst = right.unicodeScalars.first!
                let leftStartsByNumber = CharacterSet.decimalDigits.contains(leftFirst)
                let rightStartsByNumber = CharacterSet.decimalDigits.contains(rightFirst)
                switch (leftStartsByNumber, rightStartsByNumber) {
                case (true, true), (false, false):
                    return left.compare(right, options: [.numeric], range: nil, locale: nil) == .orderedAscending
                case (true, false):
                    return false
                case (false, true):
                    return true
                }
            }
            self.genesBy[.symbol] = geneBySymbol
            writeCache(for: "genes.by.symbol.cache.json", value: geneBySymbol)
        }

        // entrez
        if let geneByEntrez = readCache(for: "genes.by.entrez.cache.json", type: [Gene].self) {
            self.genesBy[.entrez] = geneByEntrez
        } else {
            let geneByEntrez = genes.sorted {
                guard let left = $0.gene else {
                    return false
                }
                guard let right = $1.gene else {
                    return true
                }
                return left < right
            }
            self.genesBy[.entrez] = geneByEntrez
            writeCache(for: "genes.by.entrez.cache.json", value: geneByEntrez)
        }
        
        // ensembl
        if let geneByEnsembl = readCache(for: "genes.by.ensembl.cache.json", type: [Gene].self) {
            self.genesBy[.ensembl] = geneByEnsembl
        } else {
            let geneByEnsembl = genes.sorted {
                let left = $0.ensembl.uppercased()
                if left.count == 0 {
                    return false
                }
                let right = $1.ensembl.uppercased()
                if right.count == 0 {
                    return true
                }
                let leftFirst = left.unicodeScalars.first!
                let rightFirst = right.unicodeScalars.first!
                let leftStartsByNumber = CharacterSet.decimalDigits.contains(leftFirst)
                let rightStartsByNumber = CharacterSet.decimalDigits.contains(rightFirst)
                switch (leftStartsByNumber, rightStartsByNumber) {
                case (true, true), (false, false):
                    return left.compare(right, options: [.numeric], range: nil, locale: nil) == .orderedAscending
                case (true, false):
                    return false
                case (false, true):
                    return true
                }
            }
            self.genesBy[.ensembl] = geneByEnsembl
            writeCache(for: "genes.by.ensembl.cache.json", value: geneByEnsembl)
        }
    }
    
    fileprivate func readGenes(useCache: Bool) -> AnyPublisher<[Gene], Error> {
        read([Gene].self, api: "/api/gene/list", cache: "genes.cache.json", useCache: useCache) { data in
            guard let rootArray = try JSONSerialization.jsonObject(with: data) as? [[Any]] else {
                throw DataServiceError.decode("Cannot extract genes")
            }

            let result: [Gene] = try rootArray.map { item in
                guard item.count == 3, let ensembl = item[0] as? String else {
                    throw DataServiceError.decode("Bad gene value")
                }
                let symbol = item[1] as? String
                let gene = item[2] as? Int

                return Gene(ensembl: ensembl, symbol: symbol, gene: gene)
            }
            return result
        }
    }
        
    fileprivate func readTissues(useCache: Bool) -> AnyPublisher<[Tissue], Error> {
        read([Tissue].self, api: "/api/tissue/list", cache: "tissues.cache.json", useCache: useCache) { data in
            let decoder = JSONDecoder()
            let internalAllData = try decoder.decode([String].self, from: data)
            return internalAllData.map { Tissue(value: $0) }
        }
    }

}
