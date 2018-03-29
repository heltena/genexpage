//
//  PlotViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/5/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit
import WebKit
import Mustache

class PlotViewController: UIViewController {
    
    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var transpLogoImageView: UIImageView!
    @IBOutlet weak var messageLabel: UILabel!
    
    private var previousPlotHash: Int?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        transpLogoImageView.isHidden = false
        messageLabel.isHidden = false
        messageLabel.text = "Tap on Edit to configure the plot"
        previousPlotHash = DataManager.main.currentPlotHash
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        webView.scrollView.isScrollEnabled = false

        let currentPlotHash = DataManager.main.currentPlotHash
        if previousPlotHash == nil || previousPlotHash! != currentPlotHash {
            self.previousPlotHash = currentPlotHash
            transpLogoImageView.isHidden = false
            messageLabel.isHidden = false
            self.renderEmptyPage()
            
            let genes = DataManager.main.geneList.filter { DataManager.main.isSelected(gene: $0) }
            let tissues = DataManager.main.tissueList.filter { DataManager.main.isSelected(tissue: $0) }
            if genes.count == 0 && tissues.count == 0 {
                self.messageLabel.text = "Select at least one gene and one tissue an try again"
                return
            } else if genes.count == 0 {
                self.messageLabel.text = "Select at least one gene an try again"
                return
            } else if tissues.count == 0 {
                self.messageLabel.text = "Select at least one tissue an try again"
                return
            } else {
                messageLabel.text = "Loading..."
            }
            
            Server.main.ageCount() {
                guard
                    let ageCount = $0
                    else {
                        DispatchQueue.main.async {
                            self.messageLabel.text = "There was an error, try again"
                        }
                        return
                }
                DispatchQueue.main.async {
                    self.transpLogoImageView.isHidden = true
                    self.messageLabel.isHidden = true
                    self.renderAgeCountPage(ageCount: ageCount)
                }
            }
        }
    }

    private func renderEmptyPage() {
        let exampleUrl = Bundle.main.url(forResource: "empty.html", withExtension: "mustache", subdirectory: "BaseHTML")!
        let template = try! Template(URL: exampleUrl)
        let html = try! template.render([])
        let baseHtml = URL(fileURLWithPath: "BaseHTML", isDirectory: true, relativeTo: Bundle.main.bundleURL)
        self.webView.loadHTMLString(html, baseURL: baseHtml)
    }
    
    private func renderAgeCountPage(ageCount: AgeCountResult) {
        let exampleUrl = Bundle.main.url(forResource: "plot.html", withExtension: "mustache", subdirectory: "BaseHTML")!
        let template = try! Template(URL: exampleUrl)
        let html = try! template.render([
            "data": ageCount.json,
            ])
        let baseHtml = URL(fileURLWithPath: "BaseHTML", isDirectory: true, relativeTo: Bundle.main.bundleURL)
        self.webView.loadHTMLString(html, baseURL: baseHtml)
    }

}


