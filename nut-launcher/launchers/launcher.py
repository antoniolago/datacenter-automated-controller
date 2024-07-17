import subprocess
#import psutil
import time

import sys
from datetime import datetime
import pathlib


_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))
from shared.api import Api
from shared.redishelper import RedisHelper
from shared.appsettings import AppSettings
from flask_socketio import SocketIO

class Launcher:
    def __init__(self):
        self.api = Api()
        self.appSettings = AppSettings()
        self.redis = RedisHelper()
        self.socketio = SocketIO(
                                    message_queue=self.appSettings.REDIS_URL, 
                                    # cors_allowed_origins='*'
                                )
    def get_all_nobreaks(self):
        nobreaks = Api().get("/nobreaks")
        return nobreaks
    
    def launch_upsd_if_not_running_already(self):
        command = ['python', '/nut-launcher/launchers/start_upsd.py']
        if self.is_process_already_running('python', command):
            return
            # print('Process is already running: '+str(command), flush=True)
        else:
            subprocess.Popen(command, stdout=subprocess.PIPE)
            print('Process started: '+str(command), flush=True)
        
    def return_timestamp_string(self):
        return datetime.fromtimestamp(datetime.timestamp(datetime.now())).strftime("[%d/%m/%Y, %H:%M:%S]   ")

    def launch_subproccess_for_each_nobreak_that_is_not_already_running(self):
        nobreaks = self.get_all_nobreaks()
        for nobreak in nobreaks:
            # if(nobreak['driver'] == "dummy-ups"):
            #     print('Skipping dummy-ups: '+str(nobreak['name']), flush=True)
            #     continue
            # Define the command to launch the Python process
            idStr = str(nobreak['id'])
            command = ['python', '/nut-launcher/launchers/start_upsdrvctl.py', idStr, nobreak['name']]
            # Check if the process is already running
            nobreak_redis_key = self.appSettings.REDIS_UPSDRVCTL_STREAM_KEY.replace('{0}', idStr)
            socketio_key = self.appSettings.SOCKET_IO_UPSDRVCTL_EVENT.replace('{0}', idStr)

            pubsub = self.redis.subscribe_to_channel(
                self.appSettings.REDIS_CHANGE_NOBREAK_CONFIG_EVENT.replace('{0}', idStr)
            )
            if self.is_process_already_running('python', command, nobreak['name']):
                # print('Process is already running: '+str(command), flush=True)
                break
            else:
                with subprocess.Popen(command, stdout=subprocess.PIPE) as p:
                    while p.poll() is None:
                        for line in iter(p.stdout.readline, b''):
                            if line == 'Connection to nut closed.':
                                print('TESTE', flush=True)
                                break
                            print("-", flush=True)
                            print(line, flush=True)
                            lineStr = self.return_timestamp_string() + line.decode('utf-8').strip() + ' - launch_subproccess_for_each_nobreak_that_is_not_already_running \n'
                            self.redis.append_stream(nobreak_redis_key, lineStr)
                            self.socketio.emit('updateNobreakEvents')
                            self.socketio.emit(socketio_key, lineStr)
                            print(pubsub.get_message(), flush=True)
                            if pubsub.get_message():
                                self.socketio.emit('updateNobreakEvents')
                                self.socketio.emit(socketio_key, self.return_timestamp_string() + """Shutting nobreak "{nobreak_name}" NUT process off """)
                                return
                print('Process started: '+str(command), flush=True)
            time.sleep(10)
            
    def is_process_already_running(self, name, command, nobreakName=""):
        if nobreakName != "":
            # Check if any process with -a {nobreak_name} is running
            check_command = ['ssh', 'root@nut', 'pgrep', '-f', f'-a {nobreakName}']
            check_process = subprocess.run(check_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # If the process is running, do not start it again
            if check_process.returncode == 0:
                # print(f"The process for nobreak {nobreakName} is already running.", flush=True)
                return True

        ps_output = subprocess.check_output(['ps', '-eo', 'pid,args']).decode('utf-8')
        for line in ps_output.splitlines()[1:]:
            fields = line.strip().split(None, 1)
            if len(fields) < 2:
                continue
            if name in fields[1] and all(arg in fields[1] for arg in command):
                return True
        return False