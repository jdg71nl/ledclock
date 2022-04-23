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

# https://docs.python.org/2/library/threading.html
# http://www.tutorialspoint.com/python/python_multithreading.htm
# http://jeffknupp.com/blog/2012/03/31/pythons-hardest-problem/
#import threading

# http://stackoverflow.com/questions/5844650/how-to-constantly-send-stdout-to-my-python-tcp-server
# https://docs.python.org/2/library/subprocess.html
#import subprocess

# https://docs.python.org/2/library/functions.html#isinstance
#import sys

# https://docs.python.org/2/library/math.html
#import math

from adafruit_ht16k33 import segments
import board
import busio

import RPi.GPIO as GPIO 
GPIO.setmode(GPIO.BCM)
pin = 9
GPIO.setup(pin, GPIO.IN)
#pin_str = "pin = {}".format(12.0)
#pin_str = "pin = {}".format(GPIO.input(pin))
#print (pin_str)

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

# jdg
# "You can set the brightness of the display, but changing it will set the brightness of the entire display and not individual segments. If can be adjusted in 1/16 increments between 0 and 1.0 with 1.0 being the brightest."
#display.brightness = 0.0
#display.brightness = 1.0
#display.brightness = 0.0 + 1/15 * step // step 0..15 // 0.15 = 0.0666667
#
def set_brightness(bstep):
  display.brightness = 0.0 + bstep / 15.0
#
#
import json
bstep_file = "/home/jdg/prod/ledclock/bstep.json"
def read_bstep() -> int:
  fh = open(bstep_file)
  data = json.load(fh)
  bstep = int(data['bstep'])
  #bstep = data['bstep']
  fh.close();
  #print("# bstep={}".format(bstep))
  return bstep
#
#
bstep = read_bstep()
set_brightness(bstep)

import os
import subprocess
command = "./ntpq-print-offset.sh"
def ntpsync() -> bool:
    #res = os.system(command)
    result_str = subprocess.check_output(command)
    result_float = float(result_str)
    return (result_float < 1000)
#
sync = False
#sync = ntpsync()
hold_time = 0
treshhold_time = 10
sleep_time = 0.5

while True:

    #
    bstep = read_bstep()
    set_brightness(bstep)

    # get system time
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute
    second = now.second

    # setup HH:MM for display and print it
    #clock = '%02d%02d' % (hour,minute)          # concat hour + minute, add leading zeros
    #display.print(clock)


    #display.top_left_dot = GPIO.input(pin)
    #
    if GPIO.input(pin):
      if hold_time:
        hold_time = hold_time + 1 # sleep_time
        datetime.datetime.now()
      else:
        hold_time = 1
      #
    else:
      hold_time = 0
    #

    if hold_time:
      clock_str = '%02d%02d' % (0, hold_time)
    else:
      clock_str = '%02d%02d' % (hour,minute)          # concat hour + minute, add leading zeros
      #
      # Toggle colon when displaying time
      if second % 2:
        display.print(':')                      # Enable colon every other second
      else:
        display.print(';')                      # Turn off colon
      #
    #
    display.print(clock_str)

    if (hold_time >= treshhold_time):
      os.system("halt")
    #

    #if second % 2:
    #    #sync = not sync
    #    sync = ntpsync()
    #    #
    #    display.top_left_dot = sync 
    ##

    #time.sleep(0.5)
    time.sleep(sleep_time)
#

#-eof

