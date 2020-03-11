//
//  Gene.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/27/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation

struct Gene: Codable, Equatable, Hashable {
    let ensembl: String
    let symbol: String?
    let gene: Int?
    
    static func == (lhs: Gene, rhs: Gene) -> Bool {
        lhs.ensembl == rhs.ensembl
    }
}

extension Gene: Identifiable {
    var id: String { return ensembl }
}

extension Gene {
   
    func representation(for selection: GeneSelection) -> String {
        switch selection {
        case .symbol:
            return symbol ?? "-"
        case .entrez:
            if let gene = gene {
                return String(format: "%9d", gene)
            } else {
                return "-"
            }
        case .ensembl:
            return ensembl
        }
    }

    func match(with text: String?) -> Bool {
        guard
            let text = text
            else {
                return true
        }
        
        if ensembl.localizedCaseInsensitiveContains(text) {
            return true
        }
        
        if symbol?.localizedCaseInsensitiveContains(text) ?? false {
            return true
        }
        
        if let gene = gene, "\(gene)".localizedCaseInsensitiveContains(text) {
            return true
        }

        return false
    }
}
