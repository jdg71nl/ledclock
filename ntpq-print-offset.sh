#!/bin/bash
#= ntpq-print-offset.sh 
# idea from: https://unix.stackexchange.com/questions/263751/script-to-check-ntp-status-and-system-time-sync
ntpq -pn | /usr/bin/awk 'BEGIN { offset=1000 } $1 ~ /\*/ { offset=$9 } END { print offset }'
#-eof
