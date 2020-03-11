//
//  PlotRenderer.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/27/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI
import Mustache
import WebKit
import Social

struct PlotRenderer: UIViewRepresentable {

    @EnvironmentObject var interfaceOrientation: InterfaceOrientation

    let ageCount: AgeCountResult
    @Binding var saveAndShareScreenshot: Bool
    let onScreenshot: (UIImage) -> Void
    
    let baseHtmlUrl = URL(fileURLWithPath: "BaseHTML", isDirectory: true, relativeTo: Bundle.main.bundleURL)
    
    func makeUIView(context: UIViewRepresentableContext<PlotRenderer>) -> WKWebView {
        WKWebView(frame: .zero)
    }
    
    func updateUIView(_ uiView: WKWebView, context: UIViewRepresentableContext<PlotRenderer>) {
        let style = interfaceOrientation.isPortrait ? uiView.traitCollection.userInterfaceStyle : .light
        let html = MustacheService.main.renderPlot(data: ageCount.toMustache, style: style)
        uiView.isOpaque = false
        uiView.backgroundColor = .clear
        uiView.loadHTMLString(html, baseURL: baseHtmlUrl)
        
        if saveAndShareScreenshot {
            DispatchQueue.main.async {
                self.saveAndShareScreenshot = false
                uiView.takeSnapshot(with: nil) { image, error in
                    if let image = image {
                        self.onScreenshot(image)
                    }
                }
            }
        }
    }
}
