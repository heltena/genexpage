//
//  PlotEditViewController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/7/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class PlotEditViewController: UITableViewController, UISearchResultsUpdating {
   
    let searchController = UISearchController(searchResultsController: nil)
    var filteredGenes: [Gene] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        searchController.searchResultsUpdater = self
        searchController.hidesNavigationBarDuringPresentation = false
        searchController.dimsBackgroundDuringPresentation = false
        searchController.searchBar.showsCancelButton = false
        searchController.searchBar.sizeToFit()
        searchController.searchBar.placeholder = "Search for gene..."

        self.tableView.tableHeaderView = searchController.searchBar
        self.definesPresentationContext = true
        for gene in DataManager.main.geneList {
            if DataManager.main.isSelected(gene: gene) {
                DataManager.main.maskAsUsed(gene: gene)
            }
        }
        filteredGenes = DataManager.sorted(geneList: DataManager.main.mostUsedGeneList, by: DataManager.main.geneSelection)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        for (index, _) in filteredGenes.enumerated() {
            tableView.selectRow(at: IndexPath(item: index + 1, section: 0), animated: false, scrollPosition: .none)
        }
    
        for (index, tissue) in DataManager.main.tissueList.enumerated() {
            if DataManager.main.isSelected(tissue: tissue) {
                tableView.selectRow(at: IndexPath(item: index, section: 1), animated: false, scrollPosition: .none)
            }
        }
        
        for (index, pfu) in DataManager.main.pfuList.enumerated() {
            if DataManager.main.isSelected(pfu: pfu) {
                tableView.selectRow(at: IndexPath(item: index, section: 2), animated: false, scrollPosition: .none)
            }
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
    
    @IBAction func geneSelectionChanged(_ sender: UISegmentedControl) {
        if let geneSelection = GeneSelection.fromSegmentedIndex(sender.selectedSegmentIndex) {
            DataManager.main.geneSelection = geneSelection
            updateFilteredGenes()
        }
    }
    
    //MARK: -UISearchResultsUpdating
    func updateSearchResults(for searchController: UISearchController) {
        updateFilteredGenes()
    }
    
    //MARK: -UITableViewDataSource
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0:
            return "gene selection"
        case 1:
            return "tissue selection"
        case 2:
            return "PFU selection"
        default:
            return ""
        }
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return max(2, filteredGenes.count + 1) // +1 for the geneSelection, one cell to tell "no gene selected" if filteredGenes is empty
        case 1:
            return DataManager.main.tissueList.count
        case 2:
            return DataManager.main.pfuList.count
        default:
            return 0
        }
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch indexPath.section {
        case 0:
            if indexPath.item == 0 {
                let cell = tableView.dequeueReusableCell(withIdentifier: "geneSelection", for: indexPath) as! GeneSelectionTableViewCell
                cell.segmentedControl.selectedSegmentIndex = DataManager.main.geneSelection.asSegmentIndex
                return cell
            } else if filteredGenes.count == 0 {
                let cell = tableView.dequeueReusableCell(withIdentifier: "gene", for: indexPath)
                cell.textLabel?.text = "No gene selected. Find them using the search bar"
                cell.textLabel?.numberOfLines = 0
                cell.isSelected = false
                cell.accessoryType = .none
                return cell
            } else {
                let cell = tableView.dequeueReusableCell(withIdentifier: "gene", for: indexPath)
                let gene = filteredGenes[indexPath.item - 1]
                cell.textLabel?.text = gene.representation(for: DataManager.main.geneSelection)
                if DataManager.main.isSelected(gene: gene) {
                    cell.isSelected = true
                    cell.accessoryType = .checkmark
                } else {
                    cell.isSelected = false
                    cell.accessoryType = .none
                }
                return cell
            }
        case 1:
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
        case 2:
            let cell = tableView.dequeueReusableCell(withIdentifier: "pfu", for: indexPath)
            let pfu = DataManager.main.pfuList[indexPath.item]
            cell.textLabel?.text = pfu.value
            if DataManager.main.isSelected(pfu: pfu) {
                cell.isSelected = true
                cell.accessoryType = .checkmark
            } else {
                cell.isSelected = false
                cell.accessoryType = .none
            }
            return cell
        default:
            fatalError("no cell at \(indexPath)")
        }
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch indexPath.section {
        case 0:
            if indexPath.item > 0 && filteredGenes.count > 0 {
                let gene = filteredGenes[indexPath.item - 1] // For the geneSelection
                DataManager.main.maskAsUsed(gene: gene)
                DataManager.main.select(gene: gene)
                tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
            }
        case 1:
            let tissue = DataManager.main.tissueList[indexPath.item]
            DataManager.main.select(tissue: tissue)
            tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
        case 2:
            let pfu = DataManager.main.pfuList[indexPath.item]
            DataManager.main.select(pfu: pfu)
            tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
        default:
            break
        }
    }
    
    override func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        switch indexPath.section {
        case 0:
            if indexPath.item > 0 && filteredGenes.count > 0 {
                let gene = filteredGenes[indexPath.item - 1] // For the geneSelection
                DataManager.main.maskAsUsed(gene: gene)
                DataManager.main.unselect(gene: gene)
                tableView.cellForRow(at: indexPath)?.accessoryType = .none
            }
        case 1:
            let tissue = DataManager.main.tissueList[indexPath.item]
            DataManager.main.unselect(tissue: tissue)
            tableView.cellForRow(at: indexPath)?.accessoryType = .none
        case 2:
            let pfu = DataManager.main.pfuList[indexPath.item]
            DataManager.main.unselect(pfu: pfu)
            tableView.cellForRow(at: indexPath)?.accessoryType = .none
        default:
            break
        }
    }

}
