#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d "{\"bstep\":$1}" http://ledclock.dgt-bv.com:8080/api/brightness
#-EOF
