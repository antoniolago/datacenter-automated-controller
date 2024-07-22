
from logging import INFO
import os
import pathlib
import sys

dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
from shared.appsettings import AppSettings
from flask import logging
from flask_socketio import SocketIO
from shared.redishelper import RedisHelper

class RedisSocketioHandler():
    def __init__(self):
        super().__init__()
        self.redis = RedisHelper()
        self.appSettings = AppSettings()
        self.socketio = SocketIO(message_queue=self.appSettings.REDIS_URL)
        self.level = INFO

    def handle(self, record):
        log_entry = record.msg
        try:
            self.redis.append_stream(self.appSettings.REDIS_RULE_APPLIER_STREAM_KEY, log_entry + '\n')
            self.socketio.emit(self.appSettings.REDIS_RULE_APPLIER_STREAM_KEY, log_entry)
        except Exception as e:
            print(e)
            pass
