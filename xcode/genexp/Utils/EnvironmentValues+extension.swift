//
//  EnvironmentValues+extension.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/9/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct InterfaceOrientationKey: EnvironmentKey {
    static let defaultValue = InterfaceOrientation()
}

extension EnvironmentValues {
    
    var interfaceOrientation: InterfaceOrientation {
        get {
            return self[InterfaceOrientationKey.self]
        }
        set {
            self[InterfaceOrientationKey.self] = newValue
        }
    }

}
