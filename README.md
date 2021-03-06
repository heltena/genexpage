# Gene Expression Viewer

The aging influenza map is a collaborative project supported by the 
**National Institute of Aging (P01AG049665)**. 

We harvested tissues from the indicated sites in the mouse over the 
lifespan and subjected them to RNA-Seq (Figure).

![](webapp/common/static/mouse.png)

Here we present our data in an interactive format. This tool allows investigators to query individual genes within different tissues that were found in the dataset. Details for the isolation and processing of individual tissues, sequencing of samples and QC metrics for the data can be found in our publication.

[You can check this viewer here](https://genexp.northwestern.edu)


## Problems trying to run

1. If you are running the server on a Mac and the `python manage.py runserver` raises a abort error, you could fix it:

https://stackoverflow.com/questions/59017071/how-to-fix-abort-issue-in-django

    $ brew install openssl
    $ cd /usr/local/lib
    $ ln -s /usr/local/Cellar/openssl@1.1/1.1.1d/lib/libcrypto.1.1.dylib libcrypto.dylib
    $ ln -s /usr/local/Cellar/openssl@1.1/1.1.1d/lib/libssl.1.1.dylib libssl.dylib


## Run on localhost

1. Create the bundle from the TSX:

    $ webpack

2. Run manage:

    $ python manage.py runserver 0.0.0.0:8000

3. Open the webpage:

    http://localhost:8000/debug   (this is the debug version)


## Create binary for website

1. Compile webpack using release mode:

    $ webpack -p
    (Note: remove first the webapp/assets/bundles files)

2. Run the fabric tasks:

    $ fab live rsync


