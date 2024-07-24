import subprocess
from shared.appsettings import AppSettings
from shared.redishelper import RedisHelper
from time import strftime, sleep
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

    def return_timestamp_string(self):
        return datetime.fromtimestamp(datetime.timestamp(datetime.now())).strftime("[%d/%m/%Y, %H:%M:%S]   ")

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
        check_and_kill_command = ['ssh', '-t', 'root@nut', 'upsdrvctl', 'stop', nobreak_name]

        # Define the SSH command to stop the driver and then start it
        start_command = ['ssh', '-t', 'root@nut', 'upsdrvctl', '-d', 'start', nobreak_name]
        
        # start_command = ['ssh', '-t', 'root@nut', 'upsdrvctl', '-d', 'start', nobreak_name]
        redis = RedisHelper()
        now = strftime('%d/%m/%Y:%H:%M:%S')
        nobreak_redis_key = self.appSettings.REDIS_UPSDRVCTL_STREAM_KEY.replace('{0}', str(nobreak_id))
        socketio_key = self.appSettings.SOCKET_IO_UPSDRVCTL_EVENT.replace('{0}', str(nobreak_id))
        channel = self.appSettings.REDIS_CHANGE_NOBREAK_CONFIG_EVENT.replace('{0}', str(nobreak_id))
        pubsub = redis.subscribe_to_channel(channel)
        with subprocess.Popen(check_and_kill_command, stdout=subprocess.PIPE) as d:
            print("Stopping driver")
        with subprocess.Popen(start_command, stdout=subprocess.PIPE) as p:
            try:
                while p.poll() is None:
                    for line in iter(p.stdout.readline, b''):
                        lineStr = line.decode('utf-8').strip()
                        print(line, flush=True)
                        if 'Connection to nut closed.' in lineStr:
                            print('TESTE', flush=True)
                            p.stdout.close()
                            p.wait()
                            redis.append_stream(nobreak_redis_key, '\n')
                            redis.close()
                            return
                        lineStr = self.return_timestamp_string() + lineStr + '\n'
                        redis.append_stream(nobreak_redis_key, lineStr)
                        self.socketio.emit(socketio_key, lineStr)
                        self.socketio.emit('updateNobreakEvents')
                        messages = pubsub.get_message()
                        if messages:
                            print(f'{now} - {messages["data"]}')
                        if messages is not None and messages["data"] == "update":
                            print("Received message to stop driver", flush=True)
                            self.socketio.emit(socketio_key, self.return_timestamp_string() + """Shutting nobreak "{nobreak_name}" NUT process off """)
                            self.socketio.emit('updateNobreakEvents')
                            raise Exception("Received message to stop driver")
            except Exception as e:
                print(e)
                p.stdout.close()
                p.wait()
                redis.append_stream(nobreak_redis_key, '\n')
                redis.close()
                raise
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
    