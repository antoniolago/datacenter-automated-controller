import pathlib
import sys
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))
from shared.appsettings import AppSettings
from datetime import datetime
import redis
class RedisHelper:
    def __init__(self):
        appSettings = AppSettings()
        self.appSettings = appSettings
        self.host = appSettings.REDIS_HOST
        self.port = appSettings.REDIS_PORT
        self.client = redis.Redis(host=appSettings.REDIS_HOST, port=appSettings.REDIS_PORT, decode_responses=True)

    def get(self, key):
        return self.client.get(key)
    
    def close(self):
        self.client.close()
    
    def append_stream(self, key, data, max_length=10000):
        # generate a unique identifier for each log entry
        log_id = datetime.now().strftime('%Y%m%d%H%M%S%f')

        # create a dictionary with the log data and the log ID
        log_dict = {'data': data, 'id': log_id}

        # add the log data to the stream
        self.client.xadd(key, log_dict)

        # trim the stream if it's too long
        length = self.client.xlen(key)
        if length > max_length:
            self.client.xtrim(key, max_length)

    def get_stream(self, key, count=1000):
        # get data in specified range
        return self.client.xrevrange(key, count=count)
    
    def publish_to_channel(self, channel, message):
        self.client.publish(channel, message)

    def subscribe_to_channel(self, channel):
        pubsub = self.client.pubsub()
        pubsub.subscribe(channel)
        return pubsub