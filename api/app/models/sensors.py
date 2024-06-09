from app import db
from sqlalchemy.orm import relationship
from sqlalchemy import event

class Sensors(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=True, unique=True)
    description = db.Column(db.Text, index=True, unique=False)
    endpointUrl = db.Column(db.Text, index=True, unique=False)
    jsonProperty = db.Column(db.Text, index=True, unique=False)

    #"H" = Humidity
    #"T" = Temperature
    sensorType = db.Column(db.Text, index=True, unique=False)
    
    def __init__(self):
        self.sensorValue = None
    
    def __repr__(self):
        return '<Sensors> {}'.format(self.description)
