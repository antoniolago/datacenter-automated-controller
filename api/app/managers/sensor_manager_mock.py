from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.util import *

class SensorManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get(self, id, filter, serialize_obj):
        sensor = super().get(id, filter, serialize_obj)
        sensor["data"] = self.get_dht22_data(sensor["pin"])
        return sensor
    
    def get_dht22_data(pin):
        return {'temperature': 25, 'humidity': 50}