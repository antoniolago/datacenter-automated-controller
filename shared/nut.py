import subprocess
from shared.appsettings import AppSettings
from shared.redishelper import RedisHelper
from datetime import datetime
from flask_socketio import SocketIO

class Nut:
    def __init__(self):
        self.appSettings = AppSettings()
        self.socketio = SocketIO(
                                    message_queue=self.appSettings.REDIS_URL, 
                                    # cors_allowed_origins='*'
                                )

    def get_properties(self, nobreak_name):
        command = f'upsc {nobreak_name}@{self.appSettings.NUT_HOST}'
        output = subprocess.getoutput(command)
        if "Error: Driver not connected" in output:
            raise Exception("Error: Driver not connected")
        return self.response_string_to_json(output)

    def start_upsd(self):# Define the command to check if upsd is running and kill it if it is
        check_and_kill_command = 'if pgrep upsd; then pkill upsd; fi'

        # Define the SSH command to start upsd
        command = ['ssh', '-t', 'root@nut', check_and_kill_command, '&&', 'upsd', '-DF']

        redis = RedisHelper()
        # Read the output of the process in real-time insert it into Redis and trigger socketio event
        with subprocess.Popen(command, stdout=subprocess.PIPE) as p:
            for line in iter(p.stdout.readline, b''):
                lineStr = self.return_timestamp_string() + line.decode('utf-8').strip() + '\n'
                redis.append_stream(self.appSettings.REDIS_UPSD_STREAM_KEY, lineStr)
                self.socketio.emit('upsdOutputNewLine', lineStr)
        p.stdout.close()
        p.wait()
        redis.append_stream(self.appSettings.REDIS_UPSD_STREAM_KEY, '\n')
        redis.close()
    
    def start_ups_driver(self, nobreak_id, nobreak_name):
        # Start the driver if the process is not running
        start_command = ['ssh', '-t', 'root@nut', 'upsdrvctl', '-d', 'start', nobreak_name]
        redis = RedisHelper()
        nobreak_redis_key = self.appSettings.REDIS_UPSDRVCTL_STREAM_KEY.replace('{0}', str(nobreak_id))

        # Read the output of the process in real-time, insert it into Redis, and trigger socketio event
        with subprocess.Popen(start_command, stdout=subprocess.PIPE) as p:
            for line in iter(p.stdout.readline, b''):
                lineStr = self.return_timestamp_string() + line.decode('utf-8').strip() + '\n'
                redis.append_stream(nobreak_redis_key, lineStr)
                self.socketio.emit('updateNobreakEvents')
                self.socketio.emit(self.appSettings.SOCKET_IO_UPSDRVCTL_EVENT.replace('{0}', str(nobreak_id)), lineStr)
        
        p.stdout.close()
        p.wait()
        redis.append_stream(nobreak_redis_key, '\n')
        redis.close()

    def response_string_to_json(self, string):
        data = {}
        lines = string.split("\n")
        for line in lines:
            if ":" in line:
                key, value = line.split(": ")
                try:
                    value = int(value)
                except ValueError:
                    try:
                        value = float(value)
                    except ValueError:
                        pass
                data[key] = value
        return data
    
    def return_timestamp_string(self):
        return datetime.fromtimestamp(datetime.timestamp(datetime.now())).strftime("[%d/%m/%Y, %H:%M:%S]   ")
    