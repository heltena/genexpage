//
//  AgeCountResult.swift
//  genexp
//
//  Created by Heliodoro Tejedor Navarro on 2/21/20.
//  Copyright © 2020 Heliodoro Tejedor Navarro. All rights reserved.
//

import Foundation

struct PointValue: Codable {
    let mean: Double
    let std: Double
    
    var toMustache: [Double] { [mean, std] }

    init(from decoder: Decoder) throws {
        var unkeyedContainer = try decoder.unkeyedContainer()
        mean = try unkeyedContainer.decode(Double.self)
        std = try unkeyedContainer.decode(Double.self)
    }
    
}

struct SerieValues: Codable {
    let values: [PointValue]
    let meanValues: [Double]
    let meanAddStdValues: [Double]
    let meanSubStdValues: [Double]
    
    func toMustache(key: String, serieName: String?) -> [String: Any] {
        ["key": key,
         "serieName": serieName ?? key,
         "color": ColorCache.main.requestColor(for: key),
         "values": values.map { $0.toMustache },
         "meanValues": meanValues.map { String($0) }.joined(separator: ", "),
         "meanAddStdValues": meanAddStdValues.map { String($0) }.joined(separator: ", "),
         "meanSubStdValues": meanSubStdValues.map { String($0) }.joined(separator: ", ")]
    }
    
    init(from decoder: Decoder) throws {
        values = try decoder.singleValueContainer().decode([PointValue].self)
        meanValues = values.map { $0.mean }
        meanAddStdValues = values.map { $0.mean + $0.std }
        meanSubStdValues = values.map { $0.mean - $0.std }
    }
    
}

struct Version: Codable {
    let id: String
    let label: String
    
    var toMustache: [String] { [id, label] }
    
    init(from decoder: Decoder) throws {
        var unkeyedContainer = try decoder.unkeyedContainer()
        id = try unkeyedContainer.decode(String.self)
        label = try unkeyedContainer.decode(String.self)
    }
}

struct AgeCountResult: Codable {
    let title: String
    let serieNames: [String: String]
    let series: [String: SerieValues]
    let version: Version
    let xAxisLabel: String
    let yAxisLabel: String
    let xAxis: String
    let xValues: [Int]
    
    var toMustache: [String: Any] {
        [
            "title": title,
            "series": series.sorted { $0.key < $1.key }.map { $0.value.toMustache(key: $0.key, serieName: serieNames[$0.key]) },
            "version": version.toMustache,
            "xAxisLabel": xAxisLabel,
            "yAxisLabel": yAxisLabel,
            "xAxis": xAxis,
            "xValues": xValues.map { String($0) }.joined(separator: ", ")
        ]
    }
    
    enum CodingKeys: String, CodingKey {
        case title, serieNames = "serie_names", series, version, xAxisLabel, yAxisLabel, xAxis = "xaxis", xValues = "xvalues"
    }

}
