from app.managers.base_manager import BaseManager
from shared.appsettings import AppSettings
from shared.redishelper import RedisHelper

from app.util import *

class RuleApplierManager(BaseManager):
    def __init__(self):
        self.appsettings = AppSettings()
        
    def get_rule_applier_output(self):
        output = RedisHelper().get_stream(self.appsettings.REDIS_RULE_APPLIER_STREAM_KEY)
        output.reverse()
        return output
