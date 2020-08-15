//
//  Text+extensions.swift
//  genexp
//
//  Created by Helio Tejedor on 8/14/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

extension Text {
    static func name(_ name: String, count: Int) -> some View {
        Text(name + (count == 0 ? "" : " (\(count))"))
    }
}

