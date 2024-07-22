import random
from app.models.sensors import Sensors
from app.managers.base_manager import BaseManager
from app.models.rules import Rules
from app import db
from app.util import *
import adafruit_dht
import board


class SensorManager(BaseManager):
    def __init__(self):
        super().__init__('sensor', Sensors)
    
    def get_sensor(self, id, filter):
        sensor = self.get(id, filter, False)
        sensor.data = self.get_dht22_data(sensor.pin)
        return create_response(True, model_to_dict(sensor))
    
    def get_dht22_data(self, pin):
        try:
            print(board.D1)
            dht = adafruit_dht.DHT22(board.D1)
            try:
                humidity = dht.humidity
                temperature = dht.temperature
            except Exception as e:
                raise Exception("Failed to read DHT22 sensor data on GPIO " + str(pin) + ": " + str(e))
        except Exception as e:
            return self.get_oscillating_values()
        temperature = round(temperature, 2)
        humidity = round(humidity, 2)
        return {'temperature': temperature, 'humidity': humidity}
    
    
    def get_oscillating_values(self, base_temp=21.59, base_humidity=64, temp_range=0.5, humidity_range=2):
        """
        Oscillate temperature and humidity values around the base values.
        
        :param base_temp: Base temperature value
        :param base_humidity: Base humidity value
        :param temp_range: Range within which temperature can oscillate
        :param humidity_range: Range within which humidity can oscillate
        :return: Dictionary with oscillating temperature and humidity
        """
        temperature = base_temp + random.uniform(-temp_range, temp_range)
        humidity = base_humidity + random.uniform(-humidity_range, humidity_range)
        return {'temperature': round(temperature, 2), 'humidity': round(humidity, 2)}
