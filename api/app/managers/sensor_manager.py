from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.models.rules import Rules
from app import db
from app.util import *

import Adafruit_DHT  # Add this import statement

DHT_SENSOR = Adafruit_DHT.DHT22

class RuleManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get(self, id, filter):
        sensor = super().get(id, filter, True)
        sensor["data"] = self.get_dht22_data(sensor["pin"])
        return sensor
    
    def get_dht22_data(pin):
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, pin)
        temperature = round(temperature, 2)
        humidity = round(humidity, 2)
        return {'temperature': temperature, 'humidity': humidity}