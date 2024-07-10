import requests
import os

class Api():
    def __init__(self):
        self.url = os.getenv("API_URL_INTERNAL")

    def get(self, url):
        return requests.get(self.url+url).json()
    
    def post(self, url, data=None, json=None, parameters=None):
        return requests.post(self.url+url, params=parameters, data=data, json=json).json()
    
    def put(self, data=None, json=None, parameters=None):
        return requests.put(self.url, params=parameters, data=data, json=json).json()
    
    def delete(self, data=None, json=None, parameters=None):
        return requests.delete(self.url, params=parameters, data=data, json=json).json()