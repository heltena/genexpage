//
//  GeneSelectionController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/8/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class GeneSelectionController {

    private(set) var searchIsActive: Bool
    private(set) var searchText: String?
    var filteredValues: [Gene] = []

    init() {
        searchIsActive = false
        for gene in DataManager.main.geneList {
            if DataManager.main.isSelected(gene: gene) {
                DataManager.main.maskAsUsed(gene: gene)
            }
        }
        filteredValues = DataManager.sorted(geneList: DataManager.main.mostUsedGeneList, by: DataManager.main.geneSelection)
    }

    func updateSearchResults(isActive: Bool, text: String?) {
        searchIsActive = isActive
        searchText = text
        let geneSelection = DataManager.main.geneSelection
        if !isActive {
            filteredValues = DataManager.sorted(geneList: DataManager.main.mostUsedGeneList, by: DataManager.main.geneSelection)
        } else if let text = text, text.count > 0 {
            filteredValues = DataManager.main.geneListBy[geneSelection]!.filter { $0.match(withText: text) }
        } else {
            filteredValues = DataManager.main.geneListBy[geneSelection]!
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return max(1, filteredValues.count)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "gene", for: indexPath)
        if filteredValues.count == 0 {
            cell.textLabel?.text = "No gene selected. Find them using the search bar"
            cell.textLabel?.numberOfLines = 0
            cell.accessoryType = .none
            tableView.deselectRow(at: indexPath, animated: false)
        } else {
            let gene = filteredValues[indexPath.item]
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
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let gene = filteredValues[indexPath.item]
        DataManager.main.maskAsUsed(gene: gene)
        DataManager.main.select(gene: gene)
        tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
    }
 
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        let gene = filteredValues[indexPath.item]
        DataManager.main.maskAsUsed(gene: gene)
        DataManager.main.unselect(gene: gene)
        tableView.cellForRow(at: indexPath)?.accessoryType = .none
    }
            
}
