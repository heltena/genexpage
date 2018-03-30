//
//  PlotEditViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/7/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class PlotEditViewController: UIViewController, UITabBarDelegate, UITableViewDataSource, UITableViewDelegate, UISearchResultsUpdating {

    enum Tabs {
        case genes
        case tissues
        case pfus
    }

    @IBOutlet weak var tabBar: UITabBar!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var geneSelectionView: UIVisualEffectView!
    @IBOutlet weak var geneSelectionSegmentedControl: UISegmentedControl!
    
    let searchController = UISearchController(searchResultsController: nil)

    var currentTab: Tabs = .genes {
        didSet {
            switch (currentTab) {
            case .genes:
                searchController.searchBar.placeholder = "Search for genes..."
                geneSelectionView.isHidden = false
                geneSelectionSegmentedControl.isHidden = false
            case .tissues:
                searchController.searchBar.placeholder = "Search for tissues..."
                geneSelectionView.isHidden = true
                geneSelectionSegmentedControl.isHidden = true
            case .pfus:
                searchController.searchBar.placeholder = "Search for PFU..."
                geneSelectionView.isHidden = true
                geneSelectionSegmentedControl.isHidden = true
            }
            tableView.reloadData()
        }
    }
    
    let geneSelectionController = GeneSelectionController()
    let tissueSelectionController = TissueSelectionController()
    let pfuSelectionController = PfuSelectionController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        searchController.searchResultsUpdater = self
        searchController.hidesNavigationBarDuringPresentation = false
        searchController.dimsBackgroundDuringPresentation = false
        searchController.searchBar.showsCancelButton = false
        self.navigationItem.searchController = searchController
        self.definesPresentationContext = true
        
        for gene in DataManager.main.geneList {
            if DataManager.main.isSelected(gene: gene) {
                DataManager.main.maskAsUsed(gene: gene)
            }
        }
        
        currentTab = .genes
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        updateSearchResults(isActive: false, text: nil)
    }
    
    func updateSearchResults(isActive: Bool, text: String?) {
        switch (currentTab) {
        case .genes:
            geneSelectionController.updateSearchResults(isActive: isActive, text: text)
        case .tissues:
            tissueSelectionController.updateSearchResults(isActive: isActive, text: text)
        case .pfus:
            pfuSelectionController.updateSearchResults(isActive: isActive, text: text)
        }
        tableView.reloadData()
    }
    
    @IBAction func geneSelectionChanged(_ sender: UISegmentedControl) {
        if let geneSelection = GeneSelection.fromSegmentedIndex(sender.selectedSegmentIndex) {
            DataManager.main.geneSelection = geneSelection
            let isActive = geneSelectionController.searchIsActive
            let searchText = geneSelectionController.searchText
            geneSelectionController.updateSearchResults(isActive: isActive, text: searchText)
            tableView.reloadData()
        }
    }
    
    //MARK: -UITabBarDelegate
    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        let isActive: Bool
        let searchText: String?
        switch (tabBar.items?.index(of: item)) {
        case 0:
            currentTab = .genes
            isActive = geneSelectionController.searchIsActive
            searchText = geneSelectionController.searchText
        case 1:
            currentTab = .tissues
            isActive = tissueSelectionController.searchIsActive
            searchText = tissueSelectionController.searchText
        case 2:
            currentTab = .pfus
            isActive = pfuSelectionController.searchIsActive
            searchText = pfuSelectionController.searchText
        default:
            return
        }
        searchController.isActive = isActive
        searchController.searchBar.text = searchText
    }

    //MARK: -UITableViewDataSource
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch (currentTab) {
        case .genes:
            return geneSelectionController.tableView(tableView, numberOfRowsInSection: section)
        case .tissues:
            return tissueSelectionController.tableView(tableView, numberOfRowsInSection: section)
        case.pfus:
            return pfuSelectionController.tableView(tableView, numberOfRowsInSection: section)
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch (currentTab) {
        case .genes:
            return geneSelectionController.tableView(tableView, cellForRowAt: indexPath)
        case .tissues:
            return tissueSelectionController.tableView(tableView, cellForRowAt: indexPath)
        case .pfus:
            return pfuSelectionController.tableView(tableView, cellForRowAt: indexPath)
        }
    }
    
    //MARK: - UITableViewDelegate
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch (currentTab) {
        case .genes:
            return geneSelectionController.tableView(tableView, didSelectRowAt: indexPath)
        case .tissues:
            return tissueSelectionController.tableView(tableView, didSelectRowAt: indexPath)
        case .pfus:
            return pfuSelectionController.tableView(tableView, didSelectRowAt: indexPath)
        }
    }
    
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        switch (currentTab) {
        case .genes:
            return geneSelectionController.tableView(tableView, didDeselectRowAt: indexPath)
        case .tissues:
            return tissueSelectionController.tableView(tableView, didDeselectRowAt: indexPath)
        case .pfus:
            return pfuSelectionController.tableView(tableView, didDeselectRowAt: indexPath)
        }
    }

    
    //MARK: -UISearchResultsUpdating
    func updateSearchResults(for searchController: UISearchController) {
        updateSearchResults(isActive: searchController.isActive, text: searchController.searchBar.text)
    }
}
