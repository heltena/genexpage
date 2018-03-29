//
//  TissueSelectionViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/16/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class TissueSelectionViewController: UITableViewController {
    
    let searchController = UISearchController(searchResultsController: nil)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        searchController.searchResultsUpdater = self
        searchController.hidesNavigationBarDuringPresentation = false
        searchController.dimsBackgroundDuringPresentation = false
        searchController.searchBar.showsCancelButton = false
        searchController.searchBar.placeholder = "Search for tissues..."
        self.definesPresentationContext = true
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tabBarController?.navigationItem.searchController = searchController
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return DataManager.main.tissueList.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "tissue", for: indexPath)
        let tissue = DataManager.main.tissueList[indexPath.item]
        cell.textLabel?.text = tissue.value
        if DataManager.main.isSelected(tissue: tissue) {
            cell.isSelected = true
            cell.accessoryType = .checkmark
        } else {
            cell.isSelected = false
            cell.accessoryType = .none
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let tissue = DataManager.main.tissueList[indexPath.item]
        DataManager.main.select(tissue: tissue)
        tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
    }
    
    override func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        let tissue = DataManager.main.tissueList[indexPath.item]
        DataManager.main.unselect(tissue: tissue)
        tableView.cellForRow(at: indexPath)?.accessoryType = .none
    }

}

extension TissueSelectionViewController: UISearchResultsUpdating {
    // MARK: - UISearchResultsUpdating Delegate
    func updateSearchResults(for searchController: UISearchController) {
    }
}

