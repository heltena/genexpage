//
//  Tissue.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation

struct Tissue: Codable, Equatable, Hashable, Identifiable {
    let id = UUID()
    let value: String
    
    static func == (lhs: Tissue, rhs: Tissue) -> Bool {
        lhs.id == rhs.id
    }

}

extension Tissue {
    
    func match(with text: String?) -> Bool {
        guard
            let text = text
            else {
                return true
        }
        return value.localizedCaseInsensitiveContains(text)
    }

}
