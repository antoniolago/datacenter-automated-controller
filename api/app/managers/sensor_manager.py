from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.models.rules import Rules
from app import db
from app.util import *

from pigpio_dht import DHT11, DHT22

class SensorManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get_sensor(self, id, filter):
        sensor = self.get(id, filter, False)
        sensor.data = self.get_dht22_data(sensor.pin)
        return create_response(True, model_to_dict(sensor))
    
    def get_dht22_data(self, gpiopin):
        try:
            sensor = DHT22(gpiopin)
            result = sensor.read()
            if result['valid']:
                temperature = round(result['temp_c'], 2)
                humidity = round(result['humidity'], 2)
            else:
                raise Exception("Invalid sensor data")
        except Exception as e:
            raise Exception(f"Failed to read DHT22 sensor data on GPIO {gpiopin}: {str(e)}")
        return {'temperature': temperature, 'humidity': humidity}