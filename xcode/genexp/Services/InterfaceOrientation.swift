//
//  InterfaceOrientation.swift
//  genexp
//
//  Created by Helio Tejedor on 8/14/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

class InterfaceOrientation: ObservableObject {
    @Published var value: UIInterfaceOrientation = .unknown
    
    var isPortrait: Bool { value.isPortrait }
    var isLandscape: Bool { value.isLandscape }
}
