//
//  Tissue.swift
//  genexp
//
//  Created by Helio Tejedor on 2/4/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class Tissue {
    let value: String
    var isSelected: Bool
    
    init(from value: String) {
        self.value = value
        self.isSelected = false
    }
}
