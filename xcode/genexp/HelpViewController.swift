//
//  HelpViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/8/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class HelpViewController: UITableViewController {
    
    @IBAction func feinbergTouched(_ sender: Any) {
        let url = URL(string: "http://feinberg.northwestern.edu")!
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
    
    @IBAction func northwesternTouched(_ sender: Any) {
        let url = URL(string: "http://www.northwestern.edu")!
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
    
    @IBAction func amaralLabTouched(_ sender: Any) {
        let url = URL(string: "http://amaral.northwestern.edu")!
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
    
    @IBAction func nihNiaTouched(_ sender: Any) {
        let url = URL(string: "http://www.nia.nih.gov")!
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
    
}
