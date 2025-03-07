#!/bin/bash
#= ledclock__check_restart.sh
# (c)202% John@de-Graaff.net
#


## JDG-NOTE: also copy this file (see inside for instructions): ./ledclock__check_restart.cron


# display every line executed in this bash script:
#set -o xtrace
#
BASENAME=`basename $0`
echo "# running: $BASENAME ... "
#SCRIPT=`realpath -s $0`  # man says: "-s, --strip, --no-symlinks : don't expand symlinks"
#SCRIPT_PATH=`dirname $SCRIPT`
#
MYUID=$( id -u )
#usage() {
#  #echo "# usage: $BASENAME { req.flag | [ -opt.flag string ] } " 1>&2 
#  echo "# usage: $BASENAME " 1>&2 
#  exit 1
#}
echo_exit1() { echo $1 ; exit 1 ; }
if [ $MYUID != 0 ]; then
  # $* is a single string, whereas $@ is an actual array.
  echo "# provide your password for 'sudo':" ; sudo "$0" "$@" ; exit 0 ;
fi
#
LOGFILE="$HOME/check_restart_cron.log"
DATE=`date +d%y%m%d-%Hh%Mm%Ss`
#
PIDFILE="/var/run/ledclock.pid"
PID=$(cat $PIDFILE)
echo "# PID (ledclock) = $PID"
# test: PID="1234567"
#
if ps --pid $PID > /dev/null
then
  echo "# 'ps --pid' says: RUNNING "
else
  echo "# 'ps --pid' says: ABSENT "
  /usr/sbin/service ledclock restart
  echo "$DATE ledclock__check_restart.sh restarting ..." >> $LOGFILE
  /usr/bin/logger "ledclock__check_restart.sh found: PID = ABSENT (restarting)"
fi
#
exit 0
#
#-eof
