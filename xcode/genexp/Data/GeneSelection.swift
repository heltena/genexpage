//
//  GeneSelection.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/3/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation


enum GeneSelection {
    case symbol
    case entrez
    case ensembl
}

extension GeneSelection {
    
    var asServerString: String {
        switch self {
        case .symbol:
            return "GENE_SYMBOL"
        case .entrez:
            return "ENTREZ_GENE_ID"
        case .ensembl:
            return "ENSEMBL_GENE_ID"
        }
    }
    
}
