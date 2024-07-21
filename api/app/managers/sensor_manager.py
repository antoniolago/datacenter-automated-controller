from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.models.rules import Rules
from app import db
from app.util import *


class SensorManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get_sensor(self, id, filter):
        sensor = self.get(id, filter, False)
        sensor.data = self.get_dht22_data(sensor.pin)
        return create_response(True, model_to_dict(sensor))
    
    def get_dht22_data(self, pin):
        try:
            import Adafruit_DHT  # Add this import statement

            DHT_SENSOR = Adafruit_DHT.DHT22
            humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, pin)
            temperature = round(temperature, 2)
            humidity = round(humidity, 2)
            return {'temperature': temperature, 'humidity': humidity}
        except:
            return {'temperature': 21, 'humidity': 50}