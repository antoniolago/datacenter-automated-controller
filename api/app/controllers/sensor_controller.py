
from flask import Flask, jsonify
from app import app

import Adafruit_DHT  # Add this import statement

# GPIO pin connected to the DHT sensor
DHT_PIN = 4
# Sensor type, DHT22
DHT_SENSOR = Adafruit_DHT.DHT22

@app.route('/api/sensor')
def get_dht22_data():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        return jsonify({'temperature': temperature, 'humidity': humidity})
    else:
        return jsonify({'error': 'Failed to retrieve data'}), 500