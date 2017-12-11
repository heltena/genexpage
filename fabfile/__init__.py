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
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py migrate --fake")
            sudo("npm run webpack")
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py collectstatic")
        with cd("/var/www/genexpage"):        
            sudo("chown -R heltena:www-data webapp")
        sudo("service apache2 restart")


@task
def tunneling():
    local("ssh -L7777:localhost:3306 {}".format(env.host))


@task 
def lists():
    for name in ['age', 'experimentalbatch', 'pfu', 'tissue', 'all']:
        print("List {}".format(name))
        r = requests.get("{}/api/{}/list".format(env.test_url, name))
        print("  Status: {}".format(r))
        print("  Result: {}".format(r.json()))


@task
def timeseries1():
    value = {
        "dataset": "mouse_aging", 
        "xaxis": "tissue",
        "series": "age",
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["flu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
    print("Status: {}".format(r))
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
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))


    
@task
def timeseries3():
    value = {
        "dataset": "mouse_aging", 
        "xaxis": "tissue",
        "series": "gene",
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["flu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))