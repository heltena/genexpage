#!/bin/bash

NAME="genexpage"
DJANGODIR=/home/htn551/genexpage/webapp
DJANGOLOGFILE=/home/htn551/genexpage/logs/gunicorn-error.log
SOCKFILE=/home/htn551/genexpage/run/gunicorn.sock
USER=htn551
GROUP=wheel
NUM_WORKERS=1                            
DJANGO_SETTINGS_MODULE=genexpage.settings
DJANGO_WSGI_MODULE=genexpage.wsgi

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source /home/htn551/venv/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec /home/htn551/venv/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --log-level debug \
  --log-file $DJANGOLOGFILE \
  --user $USER \
  --group $GROUP \
  --bind=unix:$SOCKFILE
