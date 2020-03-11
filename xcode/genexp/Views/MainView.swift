//
//  MainView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation
import SwiftUI

extension Text {
    static func name(_ name: String, count: Int) -> some View {
        Text(name + (count == 0 ? "" : " (\(count))"))
    }
}

struct MainView: View {

    @EnvironmentObject var interfaceOrientation: InterfaceOrientation
    
    @ObservedObject var dataService: DataService
    @ObservedObject var searchService: SearchService
    @ObservedObject var plotService: PlotService

    enum SheetToShow: String, Identifiable {
        case info
        case share
        
        var id: String { self.rawValue }
    }

    enum EditingSheet: String, Identifiable {
        case editGenes
        case editTissues
        
        var id: String { self.rawValue }
    }
    
    @State private var sheetToShow: SheetToShow?
    @State private var editingSheet: EditingSheet?
    @State private var savedScreenshot: UIImage?
        
    init(dataService: DataService) {
        let searchService = SearchService(dataService: dataService)
        let plotService = PlotService(dataService: dataService, searchService: searchService)
        
        self.dataService = dataService
        self.searchService = searchService
        self.plotService = plotService
    }

    var body: some View {
        ZStack {
            // Plot and Tabs
            VStack {
                PlotView(plotService: self.plotService) { image in
                    self.savedScreenshot = image
                    self.sheetToShow = .share
                }.padding(.top, interfaceOrientation.isPortrait ? 60 : 0)

                if interfaceOrientation.isPortrait {
                    Spacer()
                    HStack {
                        Button(action: {
                            self.editingSheet = .editGenes
                        }) {
                            VStack {
                                Image(systemName: "staroflife.fill")
                                Text.name("Genes", count: searchService.selectedGenes.count)
                            }
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            self.editingSheet = .editTissues
                        }) {
                            VStack {
                                Image(systemName: "heart.fill")
                                Text.name("Tissues", count: searchService.selectedTissues.count)
                            }
                        }
                    }
                    .padding([.leading, .bottom, .trailing])
                }
            }

            // Top bar
            VStack {
                HStack {
                    Spacer()
                    Button("Info") {
                        self.sheetToShow = .info
                    }
                }.padding()
                Spacer()
            }

            // Sheets
            Text("").hidden().sheet(item: $sheetToShow) { detail in
                if detail == .info {
                    InfoView()
                } else {
                    ShareImagePanel(image: self.savedScreenshot)
                }
            }

            Text("").hidden().sheet(item: $editingSheet) { detail in
                if detail == .editGenes {
                    GeneSelectionView(searchService: self.searchService)
                } else {
                    TissueSelectionView(searchService: self.searchService)
                }
            }
        }
    }
}
