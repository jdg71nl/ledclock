#!/bin/bash
#= deploy.sh
#
CONF="./config.json"
if [ ! -f $CONF ]; then
  echo "# file '$CONF' does not exist in this folder, exit(1)"
  exit 1
fi
#
DEV_DIR=$(cat $CONF| jq '.dev_dir' | sed 's/"//g')
PROD_DIR=$(cat $CONF| jq '.prod_dir' | sed 's/"//g')
#
if [ -d $PROD_DIR ]; then
  echo "# directory '$PROD_DIR' already exists"
else
  mkdir -pv $PROD_DIR
fi
#
#cp -av * $PROD_DIR
#
rsync -rtv --links --exclude '.git/' $DEV_DIR/ $PROD_DIR/
#
#-EOF
