from flask import jsonify
from typing import Any
from app import db
from sqlalchemy.orm.collections import InstrumentedList
from sqlalchemy.ext.declarative import declarative_base
import json
import sys
import socket
from ping3 import ping, verbose_ping

OperationalSystemEnum = {
    'Linux': 1,
    'Windows': 2
}
def model_to_dict(obj: Any) -> dict:
    # Convert SQLAlchemy object to dictionary.
    if isinstance(obj, list):
        return [model_to_dict(item) for item in obj]
    else:
        # Get the dictionary representation of the object's attributes
        result = {k: v for k, v in obj.__dict__.items() if not k.startswith('_')}

        # Convert any relationships to dictionaries
        for key in result:
            value = result[key]
            if isinstance(value, InstrumentedList):
                result[key] = [model_to_dict(item) for item in value]
            elif isinstance(value, declarative_base()) or isinstance(value, db.Model):
                result[key] = model_to_dict(value)

        return result
    
def serialize(obj: Any) -> dict:
    return json.dumps(obj)
    
def create_response(status, data=None, message=None, error=None):
    """Creates a default response json object."""
    
    response = {
        "success": status,
        "data": data,
        "message": message,
        "error": error
    }
    print(data, file=sys.stderr)
    return jsonify(response)

def is_response_success(json_response):
    return json_response.json['success']


def is_machine_online(ip_address):
    try:
        pingResponse = ping(ip_address)
        if(pingResponse):
            return True
        else:
            return False
        # # Create a socket connection
        # s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # s.settimeout(1)  # Timeout after 1 second
        
        # s.connect((ip_address, port))
        # s.close()
    except (socket.timeout, socket.error):
        return False