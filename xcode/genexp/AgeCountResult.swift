//
//  AgeCountResult.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/6/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class PointValue {
    let mean: Double
    let std: Double
    
    var json: [Double] {
        get {
            return [mean, std]
        }
    }

    init?(from array: [Any]) {
        guard
            let array2 = array as? [Double], array2.count == 2
            else {
                return nil
        }
        self.mean = array2[0]
        self.std = array2[1]
    }
}

class SerieValues {
    let key: String
    let serieName: String
    let values: [PointValue]
    let meanValues: [Double]
    let meanAddStdValues: [Double]
    let meanSubStdValues: [Double]
    
    var json: [String: Any] {
        get {
            return [
                "key": key,
                "serieName": serieName,
                "color": DataManager.main.requestColor(for: key),
                "values": values.map { $0.json },
                "meanValues": meanValues.map { String($0) }.joined(separator: ", "),
                "meanAddStdValues": meanAddStdValues.map { String($0) }.joined(separator: ", "),
                "meanSubStdValues": meanSubStdValues.map { String($0) }.joined(separator: ", ")
            ]
        }
    }

    init?(key: String, serieName: String, from array: [Any]) {
        var values: [PointValue] = []
        for value in array {
            guard
                let valueArray = value as? [Any],
                let pointValue = PointValue(from: valueArray)
                else {
                    return nil
            }
            values.append(pointValue)
        }
        self.key = key
        self.serieName = serieName
        self.values = values
        self.meanValues = self.values.map { $0.mean }
        self.meanAddStdValues = self.values.map { $0.mean + $0.std }
        self.meanSubStdValues = self.values.map { $0.mean - $0.std }
    }
}

class Version {
    let id: String
    let label: String
    
    var json: [String] {
        get {
            return [self.id, self.label]
        }
    }
    
    init?(from array: [Any]) {
        guard
            let array = array as? [String], array.count == 2
            else {
                return nil
        }
        self.id = array[0]
        self.label = array[1]
    }
}

class AgeCountResult {

    let title: String
    let series: [SerieValues]
    let version: Version
    let xAxisLabel: String
    let yAxisLabel: String
    let xAxis: String
    let xValues: [Int]
    
    var json: [String: Any] {
        get {
            return [
                "title": title,
                "series": series.map { $0.json },
                "version": version.json,
                "xAxisLabel": xAxisLabel,
                "yAxisLabel": yAxisLabel,
                "xAxis": xAxis,
                "xValues": xValues.map { String($0) }.joined(separator: ", ")
            ]
        }
    }
    
    init?(from dict: [String: Any]) {
        guard
            let plotType = dict["plotType"] as? String, plotType == "lines",
            let serieNames = dict["serie_names"] as? [String: String],
            let jsonSeries = dict["series"] as? [String: [Any]],
            let title = dict["title"] as? String,
            let jsonVersion = dict["version"] as? [Any],
            let version = Version(from: jsonVersion),
            let xAxisLabel = dict["xAxisLabel"] as? String,
            let xAxis = dict["xaxis"] as? String,
            let xValues = dict["xvalues"] as? [Int],
            let yAxisLabel = dict["yAxisLabel"] as? String
            else {
                return nil
        }
        
        var series: [SerieValues] = []
        for (key, values) in jsonSeries {
            guard
                let serieName = serieNames[key],
                let serieValues = SerieValues(key: key, serieName: serieName, from: values)
                else {
                    return nil
            }
            series.append(serieValues)
        }
        self.title = title
        self.series = series.sorted { $0.key < $1.key }
        self.version = version
        self.xAxisLabel = xAxisLabel
        self.yAxisLabel = yAxisLabel
        self.xAxis = xAxis
        self.xValues = xValues
    }
    
}
