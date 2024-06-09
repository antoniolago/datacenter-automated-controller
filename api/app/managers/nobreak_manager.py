from app.managers.base_manager import BaseManager
from app.managers.argument_manager import ArgumentManager
from app.models.nobreaks import Nobreaks
from shared.nut import Nut
from shared.appsettings import AppSettings
from shared.redishelper import RedisHelper
from app import db
from app import socketio
from app.util import *

class NobreakManager(BaseManager):
    def __init__(self):
        super().__init__('nobreak', Nobreaks)
        self.argument_manager = ArgumentManager()
        self.nut = Nut()
        self.appsettings = AppSettings()
        
    def map_upsc_properties(self, nobreak):
        try:
            upscResponse = self.nut.get_properties(nobreak.name)
            nobreak.__dict__['batteryCharge'] = upscResponse['battery.charge']
            nobreak.__dict__['batteryVoltage'] = upscResponse['battery.voltage']
            nobreak.__dict__['outputVoltage'] = upscResponse['output.voltage']
            nobreak.__dict__['inputVoltage'] = upscResponse['input.voltage']
            nobreak.__dict__['load'] = upscResponse['ups.load']
        except:
            return nobreak
        return nobreak
        
    def get_all_nobreaks(self, serialize_obj=False):
        nobreaks = self.get_all()
        for nobreak in nobreaks:
            nobreak = self.map_upsc_properties(nobreak)
        return model_to_dict(nobreaks)
    
    def get_upsd_output(self):
        output = RedisHelper().get_stream(self.appsettings.REDIS_UPSD_STREAM_KEY)
        return output
        
    def get_nobreak(self, id):
        nobreak = self.get(id, "id")
        nobreak = self.map_upsc_properties(nobreak)
        for machine in nobreak.machines:
            machine.isOnline = is_machine_online(machine.ip, 22)
        return model_to_dict(nobreak)
    
    def get_driver_console_output(self, id):
        output = RedisHelper().get_stream(self.appsettings.REDIS_UPSDRVCTL_STREAM_KEY.replace('{0}', str(id)))
        output.reverse()
        return output

    def add_nobreak(self, obj):
        obj['arguments'] = self.argument_manager.map_obj_list(obj['arguments'])
        response = self.add(obj)
        if is_response_success(response):
            self.add_nobreak_to_ups_conf(self.mapped_obj)
            db.session.commit()
            socketio.emit('updateNobreakEvents')
        else:
            raise Exception(f"Failed to add argument.")
        return response
        
    def update_nobreak(self, obj, filterValue, filterKey):
        obj['arguments'] = self.argument_manager.map_obj_list(obj['arguments'])
        self.update(obj, filterValue, filterKey)
        db.session.commit()
        self.update_nobreak_in_ups_conf(self.mapped_obj)
        return "Nobreak updated successfully."
        
    def delete_nobreak(self, id):
        response = self.delete(id, "id")
        if is_response_success(response):
            self.delete_nobreak_from_ups_conf(id)
            db.session.commit()
        return response
    
    def add_nobreak_to_ups_conf(self, nobreak):
        with open(self.appsettings.UPS_CONF_PATH, "a") as f:
            f.write(f"#{nobreak.name}#S\n")
            f.write(f"[{nobreak.name}]\n")
            f.write(f"\tdriver = {nobreak.driver}\n")
            f.write(f"\tport = {nobreak.port}\n")
            f.write(f"\tdesc = \"{nobreak.description}\"\n")
            for argument in nobreak.arguments:
                f.write(f"\t{argument.key} = \"{argument.value}\"\n")
            f.write(f"#{nobreak.name}#E\n")
    
    def delete_nobreak_from_ups_conf(self, nobreak):
        with open(self.appsettings.UPS_CONF_PATH, "r") as f:
            lines = f.readlines()
        with open(self.appsettings.UPS_CONF_PATH, "w") as f:
            remove_lines = False
            for line in lines:
                # Start and End mark for string matching
                if f"#{nobreak.name}#S" in line:
                    remove_lines = True
                elif f"#{nobreak.name}#E" in line:
                    remove_lines = False
                elif not remove_lines:
                    f.write(line)
    
    def update_nobreak_in_ups_conf(self, nobreak):
        self.delete_nobreak_from_ups_conf(nobreak)
        self.add_nobreak_to_ups_conf(nobreak)
    