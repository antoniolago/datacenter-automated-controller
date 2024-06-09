from app.managers.credential_manager import CredentialManager
from flasgger import swag_from
from flask import request
from app import app

@app.route('/credentials', methods=["GET"])
def get_credentials():
    return CredentialManager().get_all(True)

@app.route('/credential', methods=["GET"])
def get_credential():
    return CredentialManager().get(request)

@app.route('/credential', methods=["POST"])
def add():
    return CredentialManager().add(request.json, True)

@app.route('/credential', methods=["PUT", "PATCH"])
def update():
    return CredentialManager().update(request.json, request.json["id"], "id", True, True)

@app.route('/credential', methods=["DELETE"])
def delete():
    return CredentialManager().delete(request)