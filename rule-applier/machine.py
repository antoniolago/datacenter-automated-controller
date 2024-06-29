import os
import pathlib
import sys
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
from shared.api import Api
from logger import logger
# Set up logging
class Machine:
    def __init__(self, machine):
        self.id = machine.id
        self.name = machine.name
        self.description = machine.description
        self.isOnline = machine.isOnline
        self.ip = machine.ip
        self.mac = machine.mac
        self.operationalSystemId = machine.operationalSystemId
        self.nobreakId = machine.nobreakId

        self.ruleId = machine.ruleId
        self.rule = machine.rule

        self.credentialId = machine.credentialId
        self.credential = machine.credential
        # Add RedisSocketioHandler to logger

    def shutdown(self):
        Api().post("/api/machine/shutdown", {"id": self.id})
        
    def wake_on_lan(self):
        Api().post("/api/machine/wake_on_lan", {"id": self.id})
        
    def get_sensor_data(self):
        return Api().get("/api/sensor")
        
    def apply_rule(self):
        logger.info("Applying rule...")
        rule = self.rule

        logger.info("Fetching sensor data...")
        humidity, temperature = self.get_sensor_data()
        logger.info(f"Sensor data - Humidity: {humidity}, Temperature: {temperature}")

        isTemperatureOk = temperature < rule.temperature
        logger.info(f"Temperature check - isTemperatureOk: {isTemperatureOk}")

        isHumidityOk = humidity < rule.humidity
        logger.info(f"Humidity check - isHumidityOk: {isHumidityOk}")

        shouldShutdown = ((not isTemperatureOk or not isHumidityOk) or \
                            rule.chargeToShutdown > self.batteryCharge) and \
                            self.isOnline
        logger.info(f"Should shutdown: {shouldShutdown}")

        shouldWakeOnLan = not self.isOnline and rule.chargeToWol > self.batteryCharge
        logger.info(f"Should wake on LAN: {shouldWakeOnLan}")

        # or rule.forceOnline
        if shouldShutdown:
            logger.info("Initiating shutdown...")
            # self.shutdown()
        elif shouldWakeOnLan:
            logger.info("Initiating Wake on LAN...")
            # self.wake_on_lan()

        # Log output to Redis and emit socketio event
        self.log_to_redis_and_emit()
        
    # def log_to_redis_and_emit(self):
    #     redis = RedisHelper()
    #     command = ["your_command_here"]  # Replace with the actual command you want to run

    #     # Read the output of the process in real-time, insert it into Redis, and trigger socketio event
    #     with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as p:
    #         for line in iter(p.stdout.readline, b''):
    #             lineStr = self.return_timestamp_string() + line.decode('utf-8').strip() + '\n'
    #             redis.append_stream(self.appSettings.REDIS_UPSD_STREAM_KEY, lineStr)
    #             self.socketio.emit('upsdOutputNewLine', lineStr)
    #             logger.info(lineStr)
    #         for line in iter(p.stderr.readline, b''):
    #             lineStr = self.return_timestamp_string() + line.decode('utf-8').strip() + '\n'
    #             redis.append_stream(self.appSettings.REDIS_UPSD_STREAM_KEY, lineStr)
    #             self.socketio.emit('upsdOutputNewLine', lineStr)
    #             logger.error(lineStr)
    #     p.stdout.close()
    #     p.stderr.close()
    #     p.wait()
    #     redis.append_stream(self.appSettings.REDIS_UPSD_STREAM_KEY, '\n')
    #     redis.close()