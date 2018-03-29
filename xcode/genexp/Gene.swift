//
//  Gene.swift
//  genexp
//
//  Created by Helio Tejedor on 2/4/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class Gene: Equatable, Hashable {
    let ensembl: String
    let symbol: String?
    let gene: Int?

    var hashValue: Int {
        return [representation(for: .symbol), representation(for: .entrez), representation(for: .ensembl)].joined(separator: "").hashValue
    }
    
    init?(from array: [Any?]) {
        guard
            array.count == 3
            else {
                return nil
        }
        self.ensembl = array[0] as! String
        self.symbol = array[1] as? String
        self.gene = array[2] as? Int
    }

    var json: [Any?] {
        return [self.ensembl, self.symbol, self.gene]
    }
    
    public static func ==(lhs: Gene, rhs: Gene) -> Bool {
        return lhs.ensembl == rhs.ensembl && lhs.symbol == rhs.symbol && lhs.gene == rhs.gene
    }
    
    func representation(for selection: GeneSelection) -> String {
        switch selection {
        case .symbol:
            return symbol ?? "-"
        case .entrez:
            if let gene = gene {
                return "\(gene)"
            } else {
                return "-"
            }
        case .ensembl:
            return ensembl
        }
    }
    
    func match(withText text: String?) -> Bool {
        guard
            let text = text
            else {
                return true
        }
        
        if ensembl.contains(text) {
            return true
        }
        
        if symbol?.contains(text) ?? false {
            return true
        }
        
        if let gene = gene, "\(gene)".contains(text) {
            return true
        }

        return false
    }

}
