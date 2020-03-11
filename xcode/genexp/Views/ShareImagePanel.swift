//
//  ShareImagePanel.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 3/5/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation
import SwiftUI

struct ShareImagePanel: UIViewControllerRepresentable {

    var image: UIImage?
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<ShareImagePanel>) -> UIActivityViewController {
        let activityItems: [Any]
        if let image = image {
            activityItems = [image]
        } else {
            activityItems = []
        }
        return UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: UIViewControllerRepresentableContext<ShareImagePanel>) {
    }
}
