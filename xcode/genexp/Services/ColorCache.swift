//
//  ColorCache.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/5/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation

class ColorCache {
    
    static let main = ColorCache()
    
    private var colorPool: [String] = [
        "#17becf",  // blue-teal
        "#bcbd22",  // curry yellow-green
        "#7f7f7f",  // middle gray
        "#e377c2",  // raspberry yogurt pink
        "#8c564b",  // chestnut brown
        "#9467bd",  // muted purple
        "#d62728",  // brick red
        "#2ca02c",  // cooked asparagus green
        "#ff7f0e",  // safety orange
        "#1f77b4",  // muted blue
    ]

    private var assignedColors: [String: (color: String, timestamp: Date)] = [:]
    private init() { }
    
    func requestColor(for name: String) -> String {
        if let value = assignedColors[name] {
            assignedColors[name] = (color: value.color, timestamp: Date())
            return value.color
        }
        if colorPool.count > 0 {
            let newColor = colorPool.remove(at: 0)
            assignedColors[name] = (color: newColor, timestamp: Date())
            return newColor
        }
        
        let data = assignedColors.map { ($0, $1) }.min { $0.1.timestamp < $1.1.timestamp }
        if let (key, value) = data {
            assignedColors.removeValue(forKey: key)
            assignedColors[name] = (color: value.color, timestamp: Date())
            return value.color
        }
        return "red"
    }

}
