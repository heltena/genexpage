//
//  Image+extensions.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

extension Image {
    static let amaralLabLogo = Image("AmaralLabLogo")
    static let background = Image("Background")
    static let feinbergLogo = Image("FeinbergLogo")
    static let mouse = Image("Mouse")
    static let nihNiaLogo = Image("NihNiaLogo")
    static let northwesternLogo = Image("NorthwesternLogo")
    
    static let checkmark = Image(systemName: "checkmark")
    
    static func number(_ value: Int) -> Image {
        if (0...50).contains(value) {
            return Image(systemName: "\(value).circle")
        } else {
            return Image(systemName: "plus.circle")
        }
    }
}
