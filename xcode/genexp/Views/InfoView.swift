//
//  InfoView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/25/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct InfoView: View {
    @Environment(\.presentationMode) var presentation

    var body: some View {
        NavigationView {
            ScrollView(.vertical, showsIndicators: true) {
                Group {
                    (
                        Text("The aging influenza map is a collaborative project supported by the ") +
                        Text("National Institute of Aging (P01AG049665)")
                            .bold() +
                        Text(". We harvested tissues from the indicated sites in the mouse over the lifespan and subjected them to RNA-Seq (Figure).")
                        ).padding([.top, .bottom])

                    Image.mouse
                        .resizable()
                        .scaledToFit()

                    Text("Here we present our data in an interactive format. This tool allows investigators to query individual genes within different tissues that were found in the dataset. Details for the isolation and processing of individual tissues, sequencing of samples and QC metrics for the data can be found in our publication.")
                    .padding([.top, .bottom])

                    Image.feinbergLogo
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 44)
                        .scaledToFit()
                    Image.northwesternLogo
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 44)
                        .scaledToFit()
                    Image.amaralLabLogo
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 44)
                        .scaledToFit()
                    Image.nihNiaLogo
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 44)
                        .scaledToFit()
                }.padding()
            }
            .navigationBarTitle("Info")
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

struct InfoView_Previews: PreviewProvider {
    static var previews: some View {
        InfoView()
    }
}
