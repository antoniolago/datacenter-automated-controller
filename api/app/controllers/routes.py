from http.client import HTTPException
import json
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
import traceback
import sys
from flask import jsonify, request

class CustomHTTPException(HTTPException):
    def __init__(self, description, status_code):
        super().__init__(description)
        self.status_code = status_code

    def to_dict(self):
        return {"error": self.description}
    @app.errorhandler(Exception)
    def handle_error(error):
        response = {}
        error_details = {
            'error': str(error),
            'type': type(error).__name__,
            'traceback': traceback.format_exc(),
            'request': {
                'method': request.method,
                'url': request.url,
                'headers': dict(request.headers),
                'body': request.get_data(as_text=True)
            }
        }

        if isinstance(error, CustomHTTPException):
            response = jsonify(error.to_dict())
            response.status_code = error.status_code
            error_details['status_code'] = error.status_code
        else:
            response = jsonify(error=error_details)
            response.status_code = 500  # Internal Server Error for generic exceptions
            error_details['status_code'] = 500
        
        # Print detailed error information to stderr
        print(json.dumps(error_details, indent=4), file=sys.stderr)
        
        return response