#!/bin/bash
#
# need: > sudo npm install pm2 -g
#
# install: > sudo pm2 startup systemd -u jdg --hp /home/jdg/prod/ledclock/apiserver/
#
pm2 start -n ledclockapi /home/jdg/prod/ledclock/apiserver/run-prod.sh
#
#-EOF
