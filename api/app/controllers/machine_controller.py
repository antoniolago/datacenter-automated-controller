from app.managers.machine_manager import MachineManager
from flask import request
from app import app

machine_filter = 'id'

@app.route('/api/machines', methods=["GET"])
def get_machines():
    return MachineManager().get_all(True)

@app.route('/api/machine/<id>', methods=["GET"])
def get_machine(id):
    return MachineManager().get(id, 'id')

@app.route('/api/machine', methods=["POST"])
def add_machine():
    return MachineManager().add(request.json, True)

@app.route('/api/machine', methods=["PUT", "PATCH"])
def update_machine():
    return MachineManager().update(request.json, request.json['id'], 'id', True, True)

@app.route('/api/machine/<id>', methods=["DELETE"])
def delete_machine(id):
    return MachineManager().delete(id, machine_filter)

@app.route('/api/machine/wol', methods=["POST"])
def wakeonlan_machine():
    return MachineManager().wake_on_lan(request.json['id'])

@app.route('/api/machine/shutdown', methods=["POST"])
def shutdown_machine():
    return MachineManager().shutdown(request.json['id'])

@app.route("/api/machine/operational-systems", methods=["GET"])
def get_operational_systems():
    return MachineManager().get_operational_systems()