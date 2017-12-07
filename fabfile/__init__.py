from fabric.api import cd, env, task, local, run, settings
import json
import requests
    
@task
def siurana():
    pass


@task
def timeseries1():
    value = {
        "dataset": "mouse_aging", 
        "xaxis": "tissue",
        "series": "gene",
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["flu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}
    r = requests.post("http://127.0.0.1:8000/api/timeseries", json=value)
    print("Result: {}".format(r.json()))
    
    
@task
def timeseries2():
    value = {
        "dataset": "mouse_aging", 
        "xaxis": "gene",
        "series": "age",
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["flu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}
    r = requests.post("http://127.0.0.1:8000/api/timeseries", json=value)
    print("Result: {}".format(r.json()))
