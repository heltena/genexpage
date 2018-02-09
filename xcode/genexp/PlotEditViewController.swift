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
            if gene.isSelected {
                DataManager.main.maskAsUsed(gene: gene)
            }
        }
        filteredGenes = DataManager.main.mostUsedGeneList
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        for (index, _) in filteredGenes.enumerated() {
            tableView.selectRow(at: IndexPath(item: index + 1, section: 0), animated: false, scrollPosition: .none)
        }
    
        for (index, tissue) in DataManager.main.tissueList.enumerated() {
            if tissue.isSelected {
                tableView.selectRow(at: IndexPath(item: index, section: 1), animated: false, scrollPosition: .none)
            }
        }
        
        for (index, pfu) in DataManager.main.pfuList.enumerated() {
            if pfu.isSelected {
                tableView.selectRow(at: IndexPath(item: index, section: 2), animated: false, scrollPosition: .none)
            }
        }
    }
    
    @IBAction func geneSelectionChanged(_ sender: UISegmentedControl) {
        if let geneSelection = GeneSelection.fromSegmentedIndex(sender.selectedSegmentIndex) {
            DataManager.main.geneSelection = geneSelection
            tableView.reloadData()
        }
    }
    
    //MARK: -UISearchResultsUpdating
    func updateSearchResults(for searchController: UISearchController) {
        if !searchController.isActive {
            filteredGenes = DataManager.main.mostUsedGeneList
        } else if let text = searchController.searchBar.text, text.count > 0 {
            filteredGenes = DataManager.main.geneList.filter { $0.match(withText: text) }
        } else {
            filteredGenes = DataManager.main.geneList
        }

        tableView.reloadData()
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
                cell.isSelected = false
                cell.accessoryType = .none
                return cell
            } else {
                let cell = tableView.dequeueReusableCell(withIdentifier: "gene", for: indexPath)
                let gene = filteredGenes[indexPath.item - 1]
                cell.textLabel?.text = gene.representation(for: DataManager.main.geneSelection)
                cell.isSelected = gene.isSelected
                cell.accessoryType = gene.isSelected ? .checkmark : .none
                return cell
            }
        case 1:
            let cell = tableView.dequeueReusableCell(withIdentifier: "tissue", for: indexPath)
            let tissue = DataManager.main.tissueList[indexPath.item]
            cell.textLabel?.text = tissue.value
            cell.isSelected = tissue.isSelected
            cell.accessoryType = tissue.isSelected ? .checkmark : .none
            return cell
        case 2:
            let cell = tableView.dequeueReusableCell(withIdentifier: "pfu", for: indexPath)
            let pfu = DataManager.main.pfuList[indexPath.item]
            cell.textLabel?.text = pfu.value
            cell.isSelected = pfu.isSelected
            cell.accessoryType = pfu.isSelected ? .checkmark : .none
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
                gene.isSelected = true
                tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
            }
        case 1:
            DataManager.main.tissueList[indexPath.item].isSelected = true
            tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
        case 2:
            DataManager.main.pfuList[indexPath.item].isSelected = true
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
                gene.isSelected = false
                tableView.cellForRow(at: indexPath)?.accessoryType = .none
            }
        case 1:
            DataManager.main.tissueList[indexPath.item].isSelected = false
            tableView.cellForRow(at: indexPath)?.accessoryType = .none
        case 2:
            DataManager.main.pfuList[indexPath.item].isSelected = false
            tableView.cellForRow(at: indexPath)?.accessoryType = .none
        default:
            break
        }
    }

}
