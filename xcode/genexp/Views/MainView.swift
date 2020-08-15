//
//  MainView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation
import KYCommonTools
import SwiftUI

enum ShowingSheet: String, Identifiable {
    case info
    case share
    case editGenes
    case editTissues
    
    var id: String { self.rawValue }
}

struct MainView: View {
    @EnvironmentObject var interfaceOrientation: InterfaceOrientation
    @EnvironmentObject var dataService: DataService
    @EnvironmentObject var searchService: SearchService
    @EnvironmentObject var plotService: PlotService
    
    @State var shareScreenshot: Bool = false

    @State private var showingSheet: ShowingSheet?
    @State private var savedScreenshot: UIImage?
        
    @ViewBuilder
    func sheetView(for sheet: ShowingSheet) -> some View {
        if sheet == .info {
            InfoView()
                .accentColor(Color.northwestern)
        } else if sheet == .share {
            ShareImagePanel(image: self.savedScreenshot)
                .accentColor(Color.northwestern)
        } else if sheet == .editGenes {
            GeneSelectionView()
                .environmentObject(self.searchService)
                .accentColor(Color.northwestern)
        } else {
            TissueSelectionView()
                .environmentObject(self.searchService)
                .accentColor(Color.northwestern)
        }
    }
    
    var body: some View {
        ZStack {
            // Plot
            self.plotService.ageCountResult.map { ageCountResult in
                PlotRenderer(ageCount: ageCountResult, saveAndShareScreenshot: self.$shareScreenshot) { image in
                    self.savedScreenshot = image
                    self.showingSheet = .share
                }
                .padding(.top, interfaceOrientation.isPortrait ? 60 : 0)
            } ?? {
                BackgroundLogoView()
                    .edgesIgnoringSafeArea(.all)
                VStack {
                    Spacer()
                    if self.interfaceOrientation.isPortrait {
                        (Text("Configure the plot selecting different ") +
                            Text("genes and tissues").bold())
                            .padding()
                    } else {
                        Text("Rotate the device to edit the plot").padding()
                    }
                }.padding(.bottom, interfaceOrientation.isPortrait ? 120 : 20)
            }
            
            if self.plotService.state == .loaded && self.interfaceOrientation.isLandscape {
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Button("Share") {
                            self.shareScreenshot = true
                        }
                    }
                }.padding([.leading, .bottom, .trailing])
            }

            // Tabs
            if interfaceOrientation.isPortrait {
                VStack {
                    Spacer()
                    
                    if self.plotService.plotNeedsUpdate {
                        HStack {
                            Spacer()
                            Button(action: {
                                self.plotService.updatePlot()
                            }) {
                                HStack(alignment: .center) {
                                    Image(systemName: "arrow.clockwise")
                                    Text("Update plot")
                                    ActivityIndicator(isAnimating: self.plotService.state == .loading, style: .medium)
                                }
                                .font(.callout)
                                .foregroundColor(Color.white)
                                .padding(EdgeInsets(top: 8, leading: 20, bottom: 8, trailing: 10))
                                .background(Capsule().colorMultiply(Color.northwestern))
                            }
                            .disabled(self.plotService.state == .loading)
                            Spacer()
                        }
                    }
                    
                    HStack {
                        Spacer()
                        Button(action: {
                            self.showingSheet = .editGenes
                        }) {
                            VStack {
                                Image(systemName: "staroflife.fill")
                                Text.name("Genes", count: searchService.selectedGenes.count)
                            }
                        }
                        
                        Spacer()
                        Button(action: {
                            self.showingSheet = .editTissues
                        }) {
                            VStack {
                                Image(systemName: "heart.fill")
                                Text.name("Tissues", count: searchService.selectedTissues.count)
                            }
                        }
                        Spacer()
                    }
                    .padding(.all)
                }
            }

            // Top bar
            VStack {
                HStack {
                    Spacer()
                    Button("Info") {
                        self.showingSheet = .info
                    }
                }.padding()
                Spacer()
            }
        }
        .sheet(item: self.$showingSheet) { sheet in
            self.sheetView(for: sheet)
        }
    }
}

struct MainView_Previews: PreviewProvider {
    class Data {
        let interfaceOrientation: InterfaceOrientation
        let dataService: DataService
        let searchService: SearchService
        let plotService: PlotService
        
        init() {
            interfaceOrientation = InterfaceOrientation()
            dataService = DataService()
            searchService = SearchService(dataService: dataService)
            plotService = PlotService(dataService: dataService, searchService: searchService)
        }
    }
    
    @State static var data = Data()
    
    static var previews: some View {
        MainView()
            .environmentObject(data.interfaceOrientation)
            .environmentObject(data.dataService)
            .environmentObject(data.searchService)
            .environmentObject(data.plotService)
    }
}
    
    
