#!/usr/bin/python3
# SPDX-FileCopyrightText: 2019 Mikey Sklar for Adafruit Industries
#
# SPDX-License-Identifier: MIT

# install on Debian:
# sudo apt install -y python3-pip python3-smbus 
# pip3 install adafruit-circuitpython-ht16k33

import time
import datetime
from adafruit_ht16k33 import segments
import board
import busio

# Create the I2C interface.
i2c = busio.I2C(board.SCL, board.SDA)

# Create the LED segment class.
# This creates a 7 segment 4 character display:
display = segments.Seg7x4(i2c)
#display = segments.Seg7x4(i2c, address=0x70)
#display = segments.Seg7x4(i2c, address=0x71)
#display = segments.Seg7x4(i2c, address=0x72)

# clear display
display.fill(0)

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

    time.sleep(0.5)