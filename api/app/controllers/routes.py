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


class CustomHTTPException(HTTPException):
    def __init__(self, description, status_code):
        super().__init__(description)
        self.status_code = status_code

    def to_dict(self):
        return {"error": self.description}

@app.errorhandler(Exception)
def handle_error(error):
    response = {}
    if isinstance(error, CustomHTTPException):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
    else:
        response = jsonify(error=str(error))
        response.status_code = 500  # Internal Server Error for generic exceptions
    
    print(error, response.status_code, file=sys.stderr)
    return response
