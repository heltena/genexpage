//
//  BackgroundLogoView.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/25/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import SwiftUI

struct BackgroundLogoView: View {

    @EnvironmentObject var interfaceOrientation: InterfaceOrientation

    func maxWidth(using size: CGSize) -> CGFloat {
        interfaceOrientation.isPortrait ? size.width * 0.4 : size.width * 0.175
    }
    
    var body: some View {
        GeometryReader { proxy in
            Image.background
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: self.maxWidth(using: proxy.size))
                .scaledToFit()
        }
    }
}

struct BackgroundLogoView_Previews: PreviewProvider {
    static var previews: some View {
        BackgroundLogoView()
    }
}
