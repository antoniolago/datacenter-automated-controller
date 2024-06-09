from app.managers.nobreak_manager import NobreakManager
from flask_cors import cross_origin
from flask import request
from shared import *
from app import app

@app.route('/nobreaks', methods=["GET"])
def get_nobreaks():
    return NobreakManager().get_all_nobreaks(serialize_obj=True)

@app.route('/nobreaks/upsd-output', methods=["GET"])
def upsd_output():
    return NobreakManager().get_upsd_output()

@app.route('/nobreak/<id>', methods=["GET"])
def get_nobreak(id):
    return NobreakManager().get_nobreak(id)

@app.route('/nobreak/drivers', methods=["GET"])
def get_drivers():
    return NobreakManager().get_drivers()

@app.route('/nobreak/<id>/upsdrvctl-output', methods=["GET"])
def get_driver_console_output(id):
    return NobreakManager().get_driver_console_output(id)

@app.route('/nobreak', methods=["POST"])
@cross_origin()
def add_nobreak():
    return NobreakManager().add_nobreak(request.json)

@app.route('/nobreak/<id>', methods=["PUT", "PATCH"])
def update_nobreak(id):
    return NobreakManager().update_nobreak(request.json, id, 'name')

@app.route('/nobreak/<id>', methods=["DELETE"])
@cross_origin()
def delete_nobreak(id):
    return NobreakManager().delete_nobreak(id)