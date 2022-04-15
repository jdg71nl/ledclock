#!/bin/bash
#= deploy.sh
#
CONF="./config.json"
if [ ! -f $CONF ]; then
  echo "# file '$CONF' does not exist in this folder, exit(1)"
  exit 1
fi
#
DIR=$(cat $CONF| jq '.prod_dir' | sed 's/"//g')
if [ -d $DIR ]; then
  echo "# directory '$DIR' already exists"
else
  mkdir -pv $DIR
fi
#
cp -av * $DIR
#
#-EOF
