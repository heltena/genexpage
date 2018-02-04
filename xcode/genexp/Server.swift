//
//  Server.swift
//  genexp
//
//  Created by Helio Tejedor on 2/4/18.
//  Copyright © 2018 Helio Tejedor. All rights reserved.
//

import Foundation

class Server: NSObject, URLSessionDelegate {
    
    private var baseUrl: URL? {
        var baseComponents = URLComponents()
        baseComponents.scheme = NSURLProtectionSpaceHTTP
        baseComponents.host = "genexp.northwestern.edu"
        baseComponents.port = 80
        return baseComponents.url
    }
    private let timeoutInterval: TimeInterval = 5.0
    
    static let main = Server()
    
    private var session: URLSession? = nil
    
    private override init() {
        super.init()
        let sessionConfiguration = URLSessionConfiguration.ephemeral
        sessionConfiguration.requestCachePolicy = .reloadIgnoringLocalAndRemoteCacheData
        session = URLSession(configuration: sessionConfiguration, delegate: self, delegateQueue: nil)
    }
    
    private func restRequest<T>(path: String, body: [String: Any]? = nil, completion: @escaping (T?) -> Void) {
        
        guard
            let session = self.session,
            let baseUrl = self.baseUrl,
            let url = URL(string: path, relativeTo: baseUrl)
            else {
                completion(nil)
                return
        }
        
        var request = URLRequest(url: url.absoluteURL, cachePolicy: .useProtocolCachePolicy, timeoutInterval: timeoutInterval)
        if let body = body {
            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
                request.httpMethod = "POST"
                request.addValue("application/json", forHTTPHeaderField: "Accept")
                request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            } catch {
                completion(nil)
                return
            }
        }
        
        let task = session.dataTask(with: request) { data, response, error in
            guard
                let result: T = self.loadJSON(from: data, response: response, error: error)
                else {
                    if let data = data,
                        let str = String(data: data, encoding: .utf8)
                    {
                        print("Error on request, data: \(str)")
                    }
                    completion(nil)
                    return
            }
            completion(result)
        }
        task.resume()
    }
    
    private func loadJSON<T>(from data: Data?, response: URLResponse?, error: Error?) -> T? {
        guard
            error == nil,
            let response = response as? HTTPURLResponse, response.statusCode == 200,
            let data = data,
            let json = try? JSONSerialization.jsonObject(with: data, options: [.allowFragments]),
            let convertedJson = json as? T
            else {
                return nil
        }
        return convertedJson
    }
    
    func tissueList(completion: @escaping ([Tissue]?) -> Void) {
        restRequest(path: "/api/tissue/list") { (result: [String]?) in
            let values = result?.flatMap { Tissue(from: $0) }
            completion(values)
        }
    }
    
    func pfuList(completion: @escaping ([Pfu]?) -> Void) {
        restRequest(path: "/api/pfu/list") { (result: [String]?) in
            let values = result?.flatMap { Pfu(from: $0) }
            completion(values)
        }
    }
    func geneList(completion: @escaping ([Gene]?) -> Void) {
        restRequest(path: "/api/gene/list") { (result: [[Any?]]?) in
            let values = result?.flatMap { Gene(from: $0) }
            completion(values)
        }
    }

    
    //MARK: - URLSessionDelegate
    func urlSession(_ session: URLSession, didBecomeInvalidWithError error: Error?) {
        self.session = nil
    }
    
    func urlSessionDidFinishEvents(forBackgroundURLSession session: URLSession) {
    }
    
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        let host = "genexp.northwestern.edu"
        if challenge.protectionSpace.authenticationMethod != NSURLAuthenticationMethodServerTrust {
            completionHandler(.cancelAuthenticationChallenge, nil)
        } else if challenge.protectionSpace.host == host && challenge.protectionSpace.serverTrust != nil {
            let credential = URLCredential(trust: challenge.protectionSpace.serverTrust!)
            completionHandler(.useCredential, credential)
        } else {
            completionHandler(.rejectProtectionSpace, nil)
        }
    }

}
