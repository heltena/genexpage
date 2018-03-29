//
//  DataManager.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/5/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class DataManager {
    
    static let main = DataManager()
    
    var geneSelection: GeneSelection = .symbol
    private(set) var geneList: [Gene] = []
    private(set) var geneListBy: [GeneSelection: [Gene]] = [:]
    private(set) var pfuList: [Pfu] = []
    private(set) var tissueList: [Tissue] = []
    private(set) var mostUsedGeneList: [Gene] = []
    private var genesSelected: Set<String> = Set<String>()
    private var pfusSelected: Set<String> = Set<String>()
    private var tissuesSelected: Set<String> = Set<String>()
    
    private func hash(for array: [Int]) -> Int {
        return array.reduce(5381) { ($0 << 5) &+ $0 &+ Int($1) }
    }
    
    var currentPlotHash: Int {
        let hashValues = [
            hash(for: geneList.filter { self.isSelected(gene: $0) }.map { $0.representation(for: geneSelection).hashValue }.sorted()),
            hash(for: pfuList.filter { self.isSelected(pfu: $0) }.map { $0.value.hashValue }.sorted()),
            hash(for: tissueList.filter { self.isSelected(tissue: $0) }.map { $0.value.hashValue }.sorted())
            ]
        return hash(for: hashValues)
    }
    
    private init() {
    }

    private var colorPool: [String] = [
        "#17becf",  // blue-teal
        "#bcbd22",  // curry yellow-green
        "#7f7f7f",  // middle gray
        "#e377c2",  // raspberry yogurt pink
        "#8c564b",  // chestnut brown
        "#9467bd",  // muted purple
        "#d62728",  // brick red
        "#2ca02c",  // cooked asparagus green
        "#ff7f0e",  // safety orange
        "#1f77b4",  // muted blue
    ]

    private var assignedColors: [String: (color: String, timestamp: Date)] = [:]

    func requestColor(for name: String) -> String {
        if let value = assignedColors[name] {
            assignedColors[name] = (color: value.color, timestamp: Date())
            return value.color
        }
        if colorPool.count > 0 {
            let newColor = colorPool.remove(at: 0)
            assignedColors[name] = (color: newColor, timestamp: Date())
            return newColor
        }
        
        let data = assignedColors.map { ($0, $1) }.min { $0.1.timestamp < $1.1.timestamp }
        if let (key, value) = data {
            assignedColors.removeValue(forKey: key)
            assignedColors[name] = (color: value.color, timestamp: Date())
            return value.color
        }
        return "red"
    }

    public static func sorted(geneList: [Gene], by geneSelection: GeneSelection) -> [Gene] {
        switch geneSelection {
        case .symbol:
            return geneList.sorted {
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
        case .entrez:
            return geneList.sorted {
                guard let left = $0.gene else {
                    return false
                }
                guard let right = $1.gene else {
                    return true
                }
                return left < right
            }
        case .ensembl:
            return geneList.sorted {
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
        }
    }
    
    func waitUntilLoaded(completion: @escaping () -> Void) {
        let cache = DatasetCache()
        cache.readData { dataset in
            self.geneList = dataset?.geneList ?? []
            self.geneListBy = dataset?.geneListBy ?? [:]
            self.pfuList = dataset?.pfuList ?? []
            self.tissueList = dataset?.tissueList ?? []
            completion()
        }
    }

    func isSelected(gene: Gene) -> Bool {
        return genesSelected.contains(gene.ensembl)
    }
    
    func isSelected(tissue: Tissue) -> Bool {
        return tissuesSelected.contains(tissue.value)
    }
    
    func isSelected(pfu: Pfu) -> Bool {
        return pfusSelected.contains(pfu.value)
    }
    
    func select(gene: Gene) {
        genesSelected.insert(gene.ensembl)
    }
    
    func select(tissue: Tissue) {
        tissuesSelected.insert(tissue.value)
    }
    
    func select(pfu: Pfu) {
        pfusSelected.insert(pfu.value)
    }

    func unselect(gene: Gene) {
        genesSelected.remove(gene.ensembl)
    }
    
    func unselect(tissue: Tissue) {
        tissuesSelected.remove(tissue.value)
    }
    
    func unselect(pfu: Pfu) {
        pfusSelected.remove(pfu.value)
    }
    
    func maskAsUsed(gene: Gene) {
        if !mostUsedGeneList.contains(gene) {
            mostUsedGeneList.append(gene)
            mostUsedGeneList.sort(by: {
                $0.representation(for: geneSelection) < $1.representation(for: geneSelection)
            })
        }
    }

}
