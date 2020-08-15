//
//  TissueSelectionView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/25/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct TissueSelectionView: View {
    @EnvironmentObject var searchService: SearchService
    @Environment(\.presentationMode) var presentation

    var body: some View {
        NavigationView {
            VStack(alignment: .leading) {
                SearchBar(text: $searchService.tissueSearchText, isEditing: $searchService.tissueSearchIsEditing.animation(.easeInOut), placeholder: "Search...")
                List(searchService.showingTissues) { item in
                    HStack {
                        Text("\(item.value)")
                        Spacer()
                        if self.searchService.isSelected(tissue: item) {
                            Image.checkmark
                                .foregroundColor(.accentColor)
                        }
                    }
                    .contentShape(Rectangle()) // allows to tap on blank space
                    .onTapGesture {
                        self.searchService.toggleSelection(tissue: item)
                    }
                }.listRowInsets(EdgeInsets(top: 0, leading: 20, bottom: 0, trailing: 20))
            }
            .navigationBarTitle("Select tissues", displayMode: .inline)
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
