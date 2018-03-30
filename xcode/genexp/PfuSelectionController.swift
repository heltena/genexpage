//
//  PfuSelectionController.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/16/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import UIKit

class PfuSelectionController {

    private(set) var searchIsActive: Bool
    private(set) var searchText: String?
    var filteredValues: [Pfu] = []
    
    init() {
        searchIsActive = false
        filteredValues = DataManager.main.pfuList
    }
    
    func updateSearchResults(isActive: Bool, text: String?) {
        searchIsActive = isActive
        searchText = text
        if let text = text, text.count > 0, isActive {
            filteredValues = DataManager.main.pfuList.filter { $0.value.contains(text) }
        } else {
            filteredValues = DataManager.main.pfuList
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return filteredValues.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "tissue", for: indexPath)
        let pfu = filteredValues[indexPath.item]
        cell.textLabel?.text = pfu.value
        if DataManager.main.isSelected(pfu: pfu) {
            cell.isSelected = true
            cell.accessoryType = .checkmark
        } else {
            cell.isSelected = false
            cell.accessoryType = .none
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let pfu = filteredValues[indexPath.item]
        DataManager.main.select(pfu: pfu)
        tableView.cellForRow(at: indexPath)?.accessoryType = .checkmark
    }
    
    func tableView(_ tableView: UITableView, didDeselectRowAt indexPath: IndexPath) {
        let pfu = filteredValues[indexPath.item]
        DataManager.main.unselect(pfu: pfu)
        tableView.cellForRow(at: indexPath)?.accessoryType = .none
    }

}
