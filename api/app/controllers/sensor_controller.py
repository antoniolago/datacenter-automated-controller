
from flask import Flask, jsonify
from app import app

import Adafruit_DHT  # Add this import statement

# GPIO pin connected to the DHT sensor
DHT_PIN = 4
#TODO: Add dht pin to database and add CRUD operations for it
# Sensor type, DHT22
DHT_SENSOR = Adafruit_DHT.DHT22

@app.route('/api/sensor')
def get_dht22_data():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    temperature = round(temperature, 2)
    humidity = round(humidity, 2)
    if humidity is not None and temperature is not None:
        return jsonify({'temperature': temperature, 'humidity': humidity})
    else:
        return jsonify({'error': 'Failed to retrieve data'}), 500