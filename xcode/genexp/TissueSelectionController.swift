//
//  TissueSelectionController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/16/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class TissueSelectionController {
    
    private(set) var searchIsActive: Bool
    private(set) var searchText: String?
    var filteredValues: [Tissue] = []
    
    init() {
        searchIsActive = false
        filteredValues = DataManager.main.tissueList
    }
    
    func updateSearchResults(isActive: Bool, text: String?) {
        searchIsActive = isActive
        searchText = text
        if let text = text, text.count > 0, isActive {
            filteredValues = DataManager.main.tissueList.filter { $0.value.contains(text) }
        } else {
            filteredValues = DataManager.main.tissueList
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredValues.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "tissue", for: indexPath)
        let tissue = filteredValues[indexPath.item]
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
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let tissue = filteredValues[indexPath.item]
        DataManager.main.select(tissue: tissue)
        tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
    }
    
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        let tissue = filteredValues[indexPath.item]
        DataManager.main.unselect(tissue: tissue)
        tableView.cellForRow(at: indexPath)?.accessoryType = .none
    }

}
