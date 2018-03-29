//
//  GeneSelectionViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/8/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class GeneSelectionViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    @IBOutlet weak var tableView: UITableView!
    let searchController = UISearchController(searchResultsController: nil)
    var filteredGenes: [Gene] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        searchController.searchResultsUpdater = self
        searchController.hidesNavigationBarDuringPresentation = false
        searchController.dimsBackgroundDuringPresentation = false
        searchController.searchBar.showsCancelButton = false
        searchController.searchBar.placeholder = "Search for gene..."
        self.definesPresentationContext = true

        for gene in DataManager.main.geneList {
            if DataManager.main.isSelected(gene: gene) {
                DataManager.main.maskAsUsed(gene: gene)
            }
        }
        filteredGenes = DataManager.sorted(geneList: DataManager.main.mostUsedGeneList, by: DataManager.main.geneSelection)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tabBarController?.navigationItem.searchController = searchController
    }
    
    @IBAction func geneSelectionChanged(_ sender: UISegmentedControl) {
        if let geneSelection = GeneSelection.fromSegmentedIndex(sender.selectedSegmentIndex) {
            DataManager.main.geneSelection = geneSelection
            updateFilteredGenes()
        }
    }

    private func updateFilteredGenes() {
        let geneSelection = DataManager.main.geneSelection
        if !searchController.isActive {
            filteredGenes = DataManager.sorted(geneList: DataManager.main.mostUsedGeneList, by: DataManager.main.geneSelection)
        } else if let text = searchController.searchBar.text, text.count > 0 {
            filteredGenes = DataManager.main.geneListBy[geneSelection]!.filter { $0.match(withText: text) }
        } else {
            filteredGenes = DataManager.main.geneListBy[geneSelection]!
        }
        tableView.reloadData()
    }

    //MARK: -UITableViewDataSource
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return max(1, filteredGenes.count)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "gene", for: indexPath)
        if filteredGenes.count == 0 {
            cell.textLabel?.text = "No gene selected. Find them using the search bar"
            cell.textLabel?.numberOfLines = 0
            cell.accessoryType = .none
            tableView.deselectRow(at: indexPath, animated: false)
        } else {
            let gene = filteredGenes[indexPath.item]
            cell.textLabel?.text = gene.representation(for: DataManager.main.geneSelection)
            if DataManager.main.isSelected(gene: gene) {
                cell.accessoryType = .checkmark
                tableView.selectRow(at: indexPath, animated: false, scrollPosition: .none)
            } else {
                cell.accessoryType = .none
                tableView.deselectRow(at: indexPath, animated: false)
            }
        }
        return cell
    }
    
    //MARK: - UITableViewDelegate
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let gene = filteredGenes[indexPath.item]
        DataManager.main.maskAsUsed(gene: gene)
        DataManager.main.select(gene: gene)
        tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
    }
 
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        let gene = filteredGenes[indexPath.item]
        DataManager.main.maskAsUsed(gene: gene)
        DataManager.main.unselect(gene: gene)
        tableView.cellForRow(at: indexPath)?.accessoryType = .none
    }
            
}

extension GeneSelectionViewController: UISearchResultsUpdating {
    // MARK: - UISearchResultsUpdating Delegate
    func updateSearchResults(for searchController: UISearchController) {
        updateFilteredGenes()
    }
}
