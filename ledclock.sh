#!/bin/bash
#
/usr/bin/logger "ledclock.sh START"
#
sudo /home/jdg/prod/ledclock/ledclock.py 
#
/usr/bin/logger "ledclock.sh END (really, after crash of Python script)"
#
#-eof

