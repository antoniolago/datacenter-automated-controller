from http.client import HTTPException
from app.controllers import machine_controller
from app.controllers import nobreak_controller
from app.controllers import rule_controller
from app.controllers import appsettings_controller
from app.controllers import socket_controller
from app.controllers import credential_controller
from app.controllers import rule_applier_controller
import sys
from app import app
from flask import Flask, jsonify
from app.controllers import sensor_controller
@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    print(e, code, file=sys.stderr)
    raise e
    # return jsonify(error=str(e)), code
