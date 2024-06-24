
import pathlib
import sys

_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))
from shared.appsettings import AppSettings
from flask import logging
from flask_socketio import SocketIO
from shared.redishelper import RedisHelper

class RedisSocketioHandler(logging.Handler):
    def __init__(self):
        super().__init__()
        self.redis = RedisHelper()
        self.appSettings = AppSettings()
        self.socketio = SocketIO(message_queue=self.appSettings.REDIS_URL)

    def emit(self, record):
        log_entry = self.format(record)
        self.redis.append_stream(self.appSettings.REDIS_RULE_APPLIER_STREAM_KEY, log_entry + '\n')
        self.socketio.emit(self.appSettings.REDIS_RULE_APPLIER_STREAM_KEY, log_entry)
