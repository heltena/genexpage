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
        GeometryReader { proxy in
            Image.background
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxHeight: proxy.size.height / 1.5)
                .scaledToFit()
        }
    }
}

struct BackgroundLogoView_Previews: PreviewProvider {
    static var previews: some View {
        BackgroundLogoView()
    }
}
