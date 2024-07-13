from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.util import *

class SensorManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get(self, id, filter, serialize_obj=False):
        sensor = super().get(id, filter, False)
        sensorr = model_to_dict(sensor)
        sensorr["data"] = self.get_dht22_data(sensorr["pin"])
        return create_response(True, sensorr)
    
    def get_dht22_data(self, pin):
        return {'temperature': 25, 'humidity': 50}