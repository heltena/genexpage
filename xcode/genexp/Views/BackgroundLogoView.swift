//
//  BackgroundLogoView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/25/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct BackgroundLogoView: View {
    var body: some View {
        Image.background
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(width: 192, height: 192)
            .offset(y: -20)
            .scaledToFit()
    }
}

struct BackgroundLogoView_Previews: PreviewProvider {
    static var landscape: InterfaceOrientation {
        let result = InterfaceOrientation()
        result.value = .landscapeLeft
        return result
    }

    static var portrait: InterfaceOrientation {
        let result = InterfaceOrientation()
        result.value = .portrait
        return result
    }
    
    static var previews: some View {
        Group {
            BackgroundLogoView()
                .environmentObject(landscape)
                .previewLayout(.fixed(width: 1024, height: 768))

            BackgroundLogoView()
                .environmentObject(portrait)
                .previewLayout(.fixed(width: 768, height: 1024))
        }
    }
}
