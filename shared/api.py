import requests
import os

from shared.appsettings import AppSettings

class Api():
    def __init__(self):
        self.appSettings = AppSettings()

    def get(self, url):
        return requests.get(self.appSettings.API_INTERNAL_URL+url).json()
    
    def post(self, url, data=None, json=None, parameters=None):
        return requests.post(self.appSettings.API_INTERNAL_URL+url, params=parameters, data=data, json=json).json()
    
    def put(self, data=None, json=None, parameters=None):
        return requests.put(self.appSettings.API_INTERNAL_URL, params=parameters, data=data, json=json).json()
    
    def delete(self, data=None, json=None, parameters=None):
        return requests.delete(self.appSettings.API_INTERNAL_URL, params=parameters, data=data, json=json).json()