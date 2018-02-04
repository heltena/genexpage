//
//  Gene.swift
//  genexp
//
//  Created by Helio Tejedor on 2/4/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class Gene {
    var ensembl: String?
    var symbol: String?
    var gene: Int?
    
    init?(from array: [Any?]) {
        guard
            array.count == 3
            else {
                return nil
        }
        self.ensembl = array[0] as? String
        self.symbol = array[1] as? String
        self.gene = array[2] as? Int
    }
}
