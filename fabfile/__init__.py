from fabric.api import cd, env, task, local, run, settings, sudo
import json
import requests

env.hosts = ["localhost:8000"]
env.environment = "localhost"
env.test_url = "http://localhost:8000"

@task
def siurana():
    env.hosts = ["siurana.chem-eng.northwestern.edu"]
    env.environment = "siurana"
    env.test_url = "https://{}".format(env.hosts[0])

@task
def deploy():
    if env.environment == "siurana":
        with cd("/var/www/genexpage"):
            run("git pull origin master")
            sudo("/var/www/virtualenvs/genexpage/bin/pip install -r requirements.txt")
        with cd("/var/www/genexpage/webapp"):
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py migrate")
            sudo("npm run webpack")
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py collectstatic")
        sudo("service apache2 restart")


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
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
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
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
    print("Result: {}".format(r.json()))
