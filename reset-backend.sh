#!/bin/bash

# Start Flask
# --------------------------------------------------------------------------
# Set the home directory
export HOME_DIR=`pwd`
BACKEND_PATH="${HOME_DIR}/backend"

echo -e '\n\n*** Resetting backend app... ***\n\n'
cd $BACKEND_PATH
export FLASK_APP=./app/__init__.py
pipenv install
flask db upgrade
flask reset
