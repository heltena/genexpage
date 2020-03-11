//
//  LoadingView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct LoadingView: View {
    
    @ObservedObject var dataService = DataService()
    
    var body: some View {
        Group {
            if [.clean, .loading, .error].contains(dataService.state) {
                ZStack {
                    BackgroundLogoView()
                    VStack {
                        Spacer()
                        if dataService.state == .error {
                            Text("Cannot load the data. Check internet connection and try again")
                                .multilineTextAlignment(.center)
                                .padding()
                            Button(action: {
                                self.dataService.loadData(useCache: false)
                            }) {
                                Image(systemName: "arrow.counterclockwise")
                            }
                        } else {
                            ActivityIndicator(isAnimating: true, style: .medium)
                        }
                    }.padding(.bottom, 20)
                }
            } else {
                MainView(dataService: dataService)
            }
        }
        .onAppear {
            self.dataService.loadData(useCache: true)
        }
    }
    
}

struct LoadingView_Previews: PreviewProvider {
    static var previews: some View {
        LoadingView()
    }
}
