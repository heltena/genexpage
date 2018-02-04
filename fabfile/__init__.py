from fabric.api import cd, env, task, local, run, settings, sudo, prefix, put
from fabric.contrib.project import rsync_project
import json
import requests
import datetime
import os

env.hosts = ["localhost:8000"]
env.environment = "localhost"
env.test_url = "http://localhost:8000"

@task
def amaral():
    env.hosts = ["localhost"]
    env.environment = "localhost"
    env.test_url ="http://localhost:8000/genexpage"

@task
def siurana():
    env.hosts = ["siurana.chem-eng.northwestern.edu"]
    env.environment = "siurana"
    env.test_url = "https://{}".format(env.hosts[0])

@task
def live():
    env.hosts = ["genexp.northwestern.edu"]  # You should configure the ~/.ssh/config
    env.user = "htn551"  # Be careful
    env.environment = "genexp"
    env.test_url = "https://{}".format(env.hosts[0])

@task
def deploy():
    if env.environment == "siurana":
        with cd("/var/www/genexpage"):
            run("git pull origin master")
            sudo("/var/www/virtualenvs/genexpage/bin/pip install -r requirements.txt")
        with cd("/var/www/genexpage/webapp"):
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py migrate --fake")
            sudo("rm /var/www/genexpage/webapp/assets/bundles/*")
            sudo("npm run webpack")
            sudo("/var/www/virtualenvs/genexpage/bin/python manage.py collectstatic")
        with cd("/var/www/genexpage"):        
            sudo("chown -R heltena:www-data webapp")
        sudo("service apache2 restart")
    
    elif env.environment == "genexp":
        with prefix("source /home/htn551/venv/bin/activate"):
            with cd("/home/htn551/genexpage"):
                run("git pull origin master")
                run("pip install -r live_requirements.txt")


@task
def rsync():
    if env.environment == "genexp":
        if not os.getcwd().endswith("genexpage"):
            print("E: Should run from the root ({})".format(os.getcwd()))
            return
        sudo("service gunicorn_genexpage stop || true")
        sudo("service nginx stop || true")

        run("mkdir -p /home/htn551/genexpage")
        sudo("rm -rf /home/htn551/genexpage/webapp/static/")
        rsync_project("/home/htn551", delete=True, 
                local_dir=os.getcwd(),
                exclude=["*.pyc", ".git", ".gitignore", 
                         "data", "node_modules", ".DS_Store", ".vscode", "fabfile",
                         "notebooks", "requirements.txt", "bundles"])
        run("mkdir -p /home/htn551/genexpage/logs/")
        sudo("rm /etc/nginx/conf.d/genexpage.conf")
        sudo("rm /usr/lib/systemd/system/gunicorn_genexpage.service")
        sudo("ln -s /home/htn551/genexpage/rhel7/genexpage.conf /etc/nginx/conf.d/genexpage.conf")
        sudo("ln -s /home/htn551/genexpage/rhel7/gunicorn_genexpage.service /usr/lib/systemd/system/gunicorn_genexpage.service")
        sudo("systemctl daemon-reload")

        with prefix("source /home/htn551/venv/bin/activate"):
            with cd("/home/htn551/genexpage"):
                run("pip install -r live_requirements.txt")

            with cd("/home/htn551/genexpage/webapp"):
                sudo("python manage.py migrate --fake")
                sudo("rm -rf /home/htn551/genexpage/webapp/assets/bundles/*")
                sudo("mkdir /home/htn551/genexpage/webapp/static/")
                sudo("cp common/static/*.png /home/htn551/genexpage/webapp/static/")
                sudo("cp common/static/react*production.min.js /home/htn551/genexpage/webapp/static/")
                put("webapp/assets/bundles/bundle-fenix*.js", 
                    "/home/htn551/genexpage/webapp/static/bundle-release.js",
                    use_sudo=True)
        sudo("service nginx start")
        sudo("service gunicorn_genexpage start")


@task
def tunneling():
    local("ssh -L7777:localhost:3306 -L8000:localhost:80 {}".format(env.host))


@task
def gene_search(searchText):
    r = requests.get("{}/api/gene/search/{}".format(env.test_url, searchText))
    d = r.json()
    print("Status: {}".format(r))
    print("Result: {}".format(d))


@task
def gene_all():
    b = datetime.datetime.now()
    r = requests.get("{}/api/gene/list".format(env.test_url))
    e = datetime.datetime.now()
    print(b, e, e - b)

    d = r.json()
    print("Status: {}".format(r))
    print("Length: {}".format(len(d)))
    print("Slice: {}".format(d[0:10]))


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
            ["pfu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]],
        "geneIdentifier": "GENE_SYMBOL"}
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
            ["pfu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]],
        "geneIdentifier": "GENE_SYMBOL"}
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))


    
@task
def timeseries3():
    value = {
        "dataset": "mouse_aging", 
        "xaxis": "age",
        "series": "gene",
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["pfu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}
    r = requests.post("{}/api/timeseries".format(env.test_url), json=value)
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))

@task
def agecounts1():
    value = {
        "dataset": "mouse_aging", 
        "restrictions": [
            ["tissue", "in", ["AM", "Lung"]],
            ["pfu", "eq", 150],
            ["gene", "in", ["ENSMUSG00000000088", "ENSMUSG00000000001"]]]}    
    r = requests.post("{}/api/agecounts".format(env.test_url), json=value)
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))

@task
def agecounts2():
    value = {
        'xAxisLabel': 'Age (months)', 
        'dataset': 'mouse_aging', 
        'xaxis': 'age', 
        'series': 'gene', 
        'yAxisLabel': 'Counts', 
        'geneIdentifier': 'GENE_SYMBOL', 
        'restrictions': [
            ['gene', 'in', ['ENSMUSG00000014361']],
            ['tissue', 'in', ['Lung', 'AM']]
            ], 
        'title': ''}
    r = requests.post("{}/agecounts".format(env.test_url), json=value)
    print("Status: {}".format(r))
    print("Result: {}".format(r.json()))
