#!/usr/bin/python3
# SPDX-FileCopyrightText: 2019 Mikey Sklar for Adafruit Industries
#
# SPDX-License-Identifier: MIT

# install on Debian:
# sudo apt install -y python3-pip python3-smbus 
# pip3 install adafruit-circuitpython-ht16k33

# https://github.com/adafruit/Adafruit_CircuitPython_HT16K33
# https://docs.circuitpython.org/projects/ht16k33/en/latest/
# https://docs.circuitpython.org/projects/ht16k33/en/latest/api.html?highlight=Seg7x4#adafruit_ht16k33.segments.Seg7x4
# https://docs.circuitpython.org/projects/ht16k33/en/latest/_modules/adafruit_ht16k33/segments.html

import time
import datetime
from adafruit_ht16k33 import segments
import board
import busio

# Create the I2C interface.
i2c = busio.I2C(board.SCL, board.SDA)

# Create the LED segment class.
# This creates a 7 segment 4 character display:
# display = segments.Seg7x4(i2c)
## display = segments.Seg7x4(i2c, address=0x70)
## display = segments.Seg7x4(i2c, address=0x71)
## display = segments.Seg7x4(i2c, address=0x72)
display = segments.BigSeg7x4(i2c)

#display.bottom_left_dot(True)
#display.top_left_dot(True)
#bottom = segments.bottom_left_dot
#top    = segments.display.top_left_dot

# clear display
display.fill(0)

#import os
#import subprocess
#command = "./ntpq-print-ip-synced-peer.sh"
#def ntpsync() -> bool:
#    #res = os.system(command)
#    res = subprocess.check_output(command)
#    return (res != "")
##
#sync = False
#sync = ntpsync()

while True:
    # get system time
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute
    second = now.second

    # setup HH:MM for display and print it
    clock = '%02d%02d' % (hour,minute)          # concat hour + minute, add leading zeros
    display.print(clock)

    # Toggle colon when displaying time
    if second % 2:
        display.print(':')                      # Enable colon every other second
    else:
        display.print(';')                      # Turn off colon
    #

    #if second % 2:
    #    #sync = not sync
    #    sync = ntpsync()
    #    #
    #    display.top_left_dot = sync 
    ##

    time.sleep(0.5)
#

#-eof

