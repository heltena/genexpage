//
//  MustacheService.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/5/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation
import Mustache
import SwiftUI

class MustacheService {
    
    private var plotTemplates: [UIUserInterfaceStyle: Template]
    
    static let main = MustacheService()
    
    private init() {
        let suffixes: [(UIUserInterfaceStyle, String)] = [
            (.light, "light"),
            (.dark, "dark"),
            (.unspecified, "light")]

        var plotTemplates: [UIUserInterfaceStyle: Template] = [:]
        for (style, suffix) in suffixes {
            if let plotUrl = Bundle.main.url(forResource: "plot.\(suffix).html", withExtension: "mustache", subdirectory: "BaseHTML"),
                let plotTemplate = try? Template(URL: plotUrl) {
                plotTemplates[style] = plotTemplate
            }
        }
        self.plotTemplates = plotTemplates
    }
    
    func renderPlot(data: Any, style: UIUserInterfaceStyle) -> String {
        let html = try? plotTemplates[style]?.render(["data": data])
        return html ?? "<html></html>"
    }

}
