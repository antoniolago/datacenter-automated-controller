import os
basedir = os.path.abspath(os.path.dirname(__file__))
class AppSettings:
    def __init__(self):
        self.APP_NAME = os.getenv("APP_NAME")
        self.NUT_HOST = os.getenv("NUT_HOST")
        self.APP_DEBUG = os.getenv("APP_DEBUG")
        self.SOCKET_IO_UPSD_EVENT = os.getenv("SOCKET_IO_UPSD_EVENT")
        self.SOCKET_IO_UPSDRVCTL_EVENT = os.getenv("SOCKET_IO_UPSDRVCTL_EVENT")
        self.REDIS_HOST = os.getenv("REDIS_HOST")
        self.REDIS_PORT = os.getenv("REDIS_PORT")
        self.REDIS_URL = os.getenv("REDIS_URL") or 'redis://redis'
        self.REDIS_UPSD_STREAM_KEY = os.getenv("REDIS_UPSD_STREAM_KEY")
        self.REDIS_UPSDRVCTL_STREAM_KEY = os.getenv("REDIS_UPSDRVCTL_STREAM_KEY")
        self.UPS_CONF_PATH = os.environ.get('UPS_CONF_PATH') or "/nut/ups.conf"
        self.SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
            'sqlite:///' + os.path.join(basedir, 'datacenter-automated-controller.db').replace("shared", "api")
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.JSON_SORT_KEYS = False