//
//  GeneSelection.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/8/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

enum GeneSelection {
    case symbol
    case entrez
    case ensembl
    
    var asSegmentIndex: Int {
        switch self {
        case .symbol:
            return 0
        case .entrez:
            return 1
        case .ensembl:
            return 2
        }
    }

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
    
    static func fromSegmentedIndex(_ value: Int) -> GeneSelection? {
        switch value {
        case 0:
            return .symbol
        case 1:
            return .entrez
        case 2:
            return .ensembl
        default:
            return nil
        }
    }

}
