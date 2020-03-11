//
//  PlotService.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/4/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Combine
import SwiftUI

class PlotService: ObservableObject {
    
    @ObservedObject var dataService: DataService
    @ObservedObject var searchService: SearchService
    @Published var state: LoadingState = .clean
    @Published var ageCountResult: AgeCountResult?
    @Published var plotNeedsUpdate: Bool = false

    private var plotNeedsUpdateCancellable: AnyCancellable?
    private var updatePlotCancellable: AnyCancellable?
    @Published private var lastPlotHash: Int = [GeneSelection.symbol.hashValue].hashValue
    
    init(dataService: DataService, searchService: SearchService) {
        self.dataService = dataService
        self.searchService = searchService
        
        plotNeedsUpdateCancellable = Publishers.CombineLatest(searchService.$selectedHash, $lastPlotHash)
            .map { newValue, oldValue in
                newValue != oldValue
            }.assign(to: \.plotNeedsUpdate, on: self)
    }
    
    func updatePlot() {
        updatePlotCancellable?.cancel()
        
        state = .loading
        updatePlotCancellable = dataService.runQuery(
            selectedGenes: searchService.selectedGenes,
            selectedTissues: searchService.selectedTissues,
            geneSelection: searchService.geneSelection)
            .sink(receiveCompletion: {
                if case .failure = $0 {
                    self.ageCountResult = nil
                    self.state = .error
                } else {
                    self.state = .loaded
                }
            }) {
                self.ageCountResult = $0
                self.lastPlotHash = self.searchService.selectedHash
        }
    }

}
