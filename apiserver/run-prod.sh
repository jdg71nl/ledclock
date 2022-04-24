#!/bin/bash
#= /home/jdg/prod/ledclock/apiserver/run-prod.sh 
#DEBUG=dashboard:* npm start
#DEBUG=dashboard:* node --trace-warnings ./src/bin/www
#
DIR="/home/jdg/prod/ledclock/apiserver"
cd $DIR
#
NODE_ENV=development CONFIG_APP_PORT=8080 node ./src/bin/www
#
#-EOF
