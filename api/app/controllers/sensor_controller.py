
from flask import Flask, jsonify, request
from app import app
from app.managers.sensor_manager import SensorManager

@app.route('/api/sensors', methods=["GET"])
def get_sensors():
    return SensorManager().get_all(True)

@app.route('/api/sensor/<id>', methods=["GET"])
def get_sensor(id):
    return SensorManager().get(id, "id", True)

@app.route('/api/sensor', methods=["POST"])
def add_sensor():
    return SensorManager().add(request.json, True)

@app.route('/api/sensor', methods=["PUT", "PATCH"])
def update_sensor():
    return SensorManager().update(request.json, request.json["id"], "id", True, True)

@app.route('/api/sensor/<id>', methods=["DELETE"])
def delete_sensor(id):
    return SensorManager().delete(id, 'id')
