//
//  ViewController.swift
//  genexp
//
//  Created by Helio Tejedor on 2/4/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        Server.main.geneList { list in
            for gene in list ?? [] {
                let ensembl = gene.ensembl ?? "-"
                let symbol = gene.symbol ?? "-"
                let geneStr: String = {
                    if let g = gene.gene {
                        return "\(g)"
                    } else {
                        return "-"
                    }
                }()
                print("\(ensembl), \(symbol), \(geneStr)")
            }
        }
        
        Server.main.pfuList { list in
            for pfu in list ?? [] {
                print("\(pfu.value)")
            }
        }
        
        Server.main.tissueList { list in
            for tissue in list ?? [] {
                print("\(tissue.value)")
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

