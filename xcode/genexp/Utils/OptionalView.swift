//
//  OptionalView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/5/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct OptionalView<Value, ContentNil, Content>: View where ContentNil: View, Content: View {
    var value: Value?
    var whenNil: () -> ContentNil
    var content: (Value) -> Content

    var body: some View {
        Group {
            if value == nil {
                whenNil()
            } else {
                content(value!)
            }
        }
    }
}
