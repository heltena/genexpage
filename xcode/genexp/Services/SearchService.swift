//
//  SearchService.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/3/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Combine
import SwiftUI

struct ShowingGenes {
    let data: [Gene]
    let partial: Bool
}

class SearchService: ObservableObject {
    private static let maxGeneListCount = 50
    
    @ObservedObject var dataService: DataService
    
    @Published var geneSearchIsEditing = false
    @Published var geneSearchText = ""
    
    @Published var tissueSearchIsEditing = false
    @Published var tissueSearchText = ""
    
    @Published var geneSelection = GeneSelection.symbol
    @Published var selectedGenes: Set<Gene> = []
    @Published var selectedTissues: Set<Tissue> = []
    @Published var selectedHash: Int = 0
    
    @Published var showingGenes = ShowingGenes(data: [], partial: false)
    @Published var showingSelectedGenes: [Gene] = []
    @Published var showingTissues: [Tissue] = []
    
    private var cancellableSet = Set<AnyCancellable>()
    
    init(dataService: DataService) {
        self.dataService = dataService
        
        Publishers.CombineLatest3($selectedGenes, $selectedTissues, $geneSelection)
            .map { selectedGenes, selectedTissues, geneSelection in
                (selectedGenes.map { $0.id.hashValue } +
                    selectedTissues.map { $0.id.hashValue } +
                    [geneSelection.hashValue]).hashValue
            }
            .assign(to: \.selectedHash, on: self)
            .store(in: &cancellableSet)
    
        Publishers.CombineLatest(dataService.$tissues, $tissueSearchText)
            .map { tissues, searchText in
                if searchText.count == 0 {
                    return tissues
                } else {
                    return tissues.filter { $0.match(with: searchText) }
                }
            }
            .assign(to: \.showingTissues, on: self)
            .store(in: &cancellableSet)
        
        Publishers.CombineLatest3(dataService.$genesBy, $selectedGenes, $geneSelection)
            .map { genesBy, selectedGenes, geneSelection in
                let data = genesBy[geneSelection] ?? []
                return data.filter { selectedGenes.contains($0) }
            }
            .assign(to: \.showingSelectedGenes, on: self)
            .store(in: &cancellableSet)
        
        Publishers.CombineLatest3(dataService.$genesBy, $geneSearchText, $geneSelection)
            .map { genesBy, searchText, selection in
                (searchText, genesBy[selection] ?? [])
            }
            .map { (searchText: String, genes: [Gene]) -> [Gene] in
                if searchText.count == 0 {
                    return genes
                } else {
                    return genes.filter { $0.match(with: searchText) }
                }
            }
            .map { genes in
                ShowingGenes(data: Array(genes[0..<min(genes.count, SearchService.maxGeneListCount)]),
                 partial: genes.count > SearchService.maxGeneListCount)
            }
            .assign(to: \.showingGenes, on: self)
            .store(in: &cancellableSet)
    }

    func isSelected(gene: Gene) -> Bool {
        selectedGenes.contains(gene)
    }
    
    func toggleSelection(gene: Gene) {
        if selectedGenes.remove(gene) == nil {
            selectedGenes.insert(gene)
        }
    }
    
    func isSelected(tissue: Tissue) -> Bool {
        selectedTissues.contains(tissue)
    }
    
    func toggleSelection(tissue: Tissue) {
        if selectedTissues.remove(tissue) == nil {
            selectedTissues.insert(tissue)
        }
    }

}

