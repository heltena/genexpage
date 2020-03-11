//
//  PlotView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/9/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct PlotView: View {
    
    @EnvironmentObject var interfaceOrientation: InterfaceOrientation
    @ObservedObject var plotService: PlotService
    @State var shareScreenshot: Bool = false
    let onScreenshot: (UIImage) -> Void
    
    var body: some View {
        ZStack {
            OptionalView(value: $plotService.ageCountResult.wrappedValue, whenNil: {
                Group {
                    BackgroundLogoView()
                    VStack {
                        Spacer()
                        if self.interfaceOrientation.isPortrait {
                            (Text("Configure the plot selecting different ") +
                                Text("genes and tissues").bold())
                                .padding()
                        } else {
                            Text("Rotate the device to edit the plot").padding()
                        }
                    }.padding(.bottom, 40)
                }
            }) { value in
                PlotRenderer(ageCount: value, saveAndShareScreenshot: self.$shareScreenshot, onScreenshot: self.onScreenshot)
            }
            
            VStack {
                Spacer()
                ZStack {
                    if self.plotService.plotNeedsUpdate && self.plotService.state != .loading {
                        HStack {
                            Button("Update plot") {
                                self.plotService.updatePlot()
                            }
                        }
                    }

                    if self.plotService.state == .loading {
                        HStack {
                            ActivityIndicator(isAnimating: true, style: .medium)
                        }
                    }

                    if self.plotService.state == .loaded && self.interfaceOrientation.isLandscape {
                        HStack {
                            Spacer()
                            Button("Share") {
                                self.shareScreenshot = true
                            }
                        }
                    }
                }
            }.padding([.leading, .bottom, .trailing])
        }
        .edgesIgnoringSafeArea(interfaceOrientation.isLandscape ? [.top, .bottom] : [])
    }
    
}
