//
//  GeneSelectionView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/3/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct GeneSelectionView: View {
    @EnvironmentObject var searchService: SearchService
    @Environment(\.presentationMode) var presentation

    var body: some View {
        NavigationView {
            VStack(alignment: .leading) {
                SearchBar(text: $searchService.geneSearchText, isEditing: $searchService.geneSearchIsEditing.animation(.easeInOut), placeholder: "Search...")
                Picker(selection: $searchService.geneSelection, label: EmptyView()) {
                    Text("SYMBOL").tag(GeneSelection.symbol)
                    Text("ENTREZ").tag(GeneSelection.entrez)
                    Text("ENSEMBL").tag(GeneSelection.ensembl)
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding([.leading, .trailing])
                
                List {
                    if self.searchService.showingSelectedGenes.count > 0 {
                        Section(header: Text("Selected")) {
                            ForEach(self.searchService.showingSelectedGenes) { item in
                                HStack {
                                    Text("\(item.representation(for: self.searchService.geneSelection))")
                                    Spacer()
                                    if self.searchService.selectedGenes.contains(item) {
                                        Image.checkmark
                                            .foregroundColor(.accentColor)
                                    }
                                }
                                .contentShape(Rectangle()) // allows to tap on blank space
                                .onTapGesture {
                                    self.searchService.toggleSelection(gene: item)
                                }
                            }
                        }
                    }

                    Section(header: Text("Others")) {
                        ForEach(searchService.showingGenes.data) { item in
                            HStack {
                                Text("\(item.representation(for: self.searchService.geneSelection))")
                                Spacer()
                                if self.searchService.selectedGenes.contains(item) {
                                    Image.checkmark
                                        .foregroundColor(.accentColor)
                                }
                            }
                            .contentShape(Rectangle()) // allows to tap on blank space
                            .onTapGesture {
                                self.searchService.toggleSelection(gene: item)
                            }
                        }
                        if searchService.showingGenes.partial {
                            Text("...")
                        }
                    }
                }
                .listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
            }
            .navigationBarTitle("Select genes", displayMode: .inline)
            .navigationBarItems(trailing: Button(action: {
                self.presentation.wrappedValue.dismiss()
            }) {
                Image.xmark
            })
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .edgesIgnoringSafeArea(.top)
    }
}
