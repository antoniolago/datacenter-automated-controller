from app import db
from sqlalchemy.orm import relationship
from sqlalchemy import event

class Sensors(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=False, unique=False)
    description = db.Column(db.Text, index=False, unique=False)
    pin = db.Column(db.Integer, index=False, unique=False)
    minCriticalTemperatureThreshold = db.Column(db.Text, index=False, unique=False)
    maxCriticalTemperatureThreshold = db.Column(db.Text, index=False, unique=False)
    minCriticalHumidityThreshold = db.Column(db.Text, index=False, unique=False)
    maxCriticalHumidityThreshold = db.Column(db.Text, index=False, unique=False)
    minWarningTemperatureThreshold = db.Column(db.Text, index=False, unique=False)
    maxWarningTemperatureThreshold = db.Column(db.Text, index=False, unique=False)
    minWarningHumidityThreshold = db.Column(db.Text, index=False, unique=False)
    maxWarningHumidityThreshold = db.Column(db.Text, index=False, unique=False)
    
    def __init__(self):
        self.sensorValue = None
    
    def __repr__(self):
        return '<Sensors> {}'.format(self.description)
