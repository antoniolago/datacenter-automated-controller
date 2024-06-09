import subprocess
#import psutil
import time

import sys
import pathlib
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))

from shared.api import Api

class Launcher:
    def __init__(self):
        self.api = Api()
    def get_all_nobreaks(self):
        nobreaks = Api().get("/nobreaks")
        return nobreaks
    
    def launch_upsd_if_not_running_already(self):
        command = ['python', '/nut-launcher/launchers/start_upsd.py']
        if self.is_process_already_running('python', command):
            print('Process is already running: '+str(command), flush=True)
        else:
            subprocess.Popen(command, stdout=subprocess.PIPE)
            print('Process started: '+str(command), flush=True)
        
    def launch_subproccess_for_each_nobreak_that_is_not_already_running(self):
        nobreaks = self.get_all_nobreaks()
        for nobreak in nobreaks:
            # if(nobreak['driver'] == "dummy-ups"):
            #     print('Skipping dummy-ups: '+str(nobreak['name']), flush=True)
            #     continue
            # Define the command to launch the Python process
            command = ['python', '/nut-launcher/launchers/start_upsdrvctl.py', str(nobreak['id']), nobreak['name']]
            # Check if the process is already running
            if self.is_process_already_running('python', command):
                print('Process is already running: '+str(command), flush=True)
                break
            else:
                subprocess.Popen(command, stdout=subprocess.PIPE)
                print('Process started: '+str(command), flush=True)
            time.sleep(10)
            
    def is_process_already_running(self, name, command):
        ps_output = subprocess.check_output(['ps', '-eo', 'pid,args']).decode('utf-8')
        for line in ps_output.splitlines()[1:]:
            fields = line.strip().split(None, 1)
            if len(fields) < 2:
                continue
            if name in fields[1] and all(arg in fields[1] for arg in command):
                return True
        return False