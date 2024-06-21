
from flask import Flask, jsonify
from app import app

@app.route('/api/sensor')
def get_dht22_data():
    return jsonify({'temperature': 23, 'humidity': 5})