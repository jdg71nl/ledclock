#!/usr/bin/python3

# https://learn.adafruit.com/adafruit-led-backpack?view=all

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

# jdg
# "You can set the brightness of the display, but changing it will set the brightness of the entire display and not individual segments. If can be adjusted in 1/16 increments between 0 and 1.0 with 1.0 being the brightest."
#display.brightness = 0.0
#display.brightness = 1.0
#display.brightness = 0.0 + 1/15 * step // step 0..15 // 0.15 = 0.0666667
#
def set_brightness(bs):
  bstep = bs
  if bstep < 0.0 :
    bstep = 0.0
  #
  if bstep > 15.0 :
    bstep = 15.0
  #
  display.brightness = 0.0 + bstep / 15.0
#
#
import json
bstep_file = "/home/jdg/prod/ledclock/bstep.json"
#bstep_file = "/home/jdg/dev/ledclock/bstep.json"
def read_bstep() -> int:
  #
  #fh = open(bstep_file)
  #data = json.load(fh)
  #bstep = int(data['bstep'])
  ##bstep = data['bstep']
  #fh.close();
  ##print("# bstep={}".format(bstep))
  #
  bstep = 5 # default
  with open(bstep_file, "r") as fh:
    try:
      data = json.load(fh)
      bstep_raw = data['bstep']
      bstep = int(bstep_raw)
    except:
      bstep = 5
    #
  #
  return bstep
#
#
bstep = read_bstep()
set_brightness(bstep)

# clear display
display.fill(0)

#
import os

#
sleep_time = 0.5

while True:

    # get system time
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute
    second = now.second

    # setup HH:MM for display and print it
    #clock = '%02d%02d' % (hour,minute)          # concat hour + minute, add leading zeros
    #display.print(clock)

    clock_str = '%02d%02d' % (hour,minute)          # concat hour + minute, add leading zeros
    #
    # Toggle colon when displaying time
    if second % 2:
      display.print(':')                      # Enable colon every other second
    else:
      display.print(';')                      # Turn off colon
    #
    
    display.print(clock_str)

    #time.sleep(0.5)
    time.sleep(sleep_time)
#

#-eof

