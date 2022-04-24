#!/bin/bash
#
#DEBUG=dashboard:* npm start
#DEBUG=dashboard:* node --trace-warnings ./src/bin/www
#
NODE_ENV=development CONFIG_APP_PORT=8080 node ./src/bin/www
#
#-EOF
