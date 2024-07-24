#!/bin/sh

# Clone the Adafruit Python DHT library
git clone https://github.com/adafruit/Adafruit_Python_DHT

# Build and install the Adafruit Python DHT library
cd Adafruit_Python_DHT
python setup.py build
python setup.py install --force-pi

# Run the main Python script
python /api/main.py