import os
import pathlib
import sys

from flask import jsonify
import requests
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
from shared.api import Api
from logger import logger
# Set up logging
class Machine:
    def __init__(self, machine, nobreak):
        self.id = machine["id"]
        self.name = machine["name"]
        self.description = machine["description"]
        self.isOnline = machine["isOnline"]
        self.host = machine["host"]
        self.mac = machine["mac"]
        self.operationalSystemId = machine["operationalSystemId"]
        self.nobreakId = machine["nobreakId"]

        self.ruleId = machine["ruleId"]
        if(machine["ruleId"] == "inherit"):
        
            self.rule = nobreak["rule"]
        else:
            self.rule = machine["rule"]

        self.credentialId = machine["credentialId"]
        self.credential = machine["credential"]
        # Add RedisSocketioHandler to logger

    
    def shutdown(self):
        try:
            url = os.getenv("API_URL_INTERNAL")
            if not url:
                logger.error("API_URL_INTERNAL is not set")
                return {"error": "Internal server error"}, 500
            
            # Convert machine ID to string
            machine_id = str(self.id)
            logger.info(f"Applying shutdown to: {machine_id}...")
            
            # Make the POST request
            response = requests.post(f"{url}/machine/shutdown", json={"id": machine_id})
            
            # Check for response status
            if response.status_code == 200:
                logger.info(f"Shutdown applied to: {machine_id}")
                return response.json(), 200
            else:
                logger.error(f"Failed to apply shutdown to: {machine_id}, Status code: {response.status_code}, Response: {response.text}")
                return {"error": "Failed to shutdown machine"}, response.status_code
        
        except requests.exceptions.RequestException as e:
            # logger.error(f"Request exception: {e}")
            return {"error": "Failed to shutdown machine"}, 500
        
        except Exception as e:
            # logger.error(f"Unexpected error: {e}")
            return {"error": "Internal server error"}, 500
    def wake_on_lan(self):
        try:
            url = os.getenv("API_URL_INTERNAL")
            if not url:
                logger.error("API_URL_INTERNAL is not set")
                return {"error": "Internal server error"}, 500
            
            # Convert machine ID to string
            machine_id = str(self.id)
            logger.info(f"Applying wake-on-lan to: {machine_id}...")
            
            # Make the POST request
            response = requests.post(f"{url}/machine/wol", json={"id": machine_id})
            
            # Check for response status
            if response.status_code == 200:
                logger.info(f"Shutdown applied to: {machine_id}")
                return response.json(), 200
            else:
                logger.error(f"Failed to apply wol to: {machine_id}, Status code: {response.status_code}, Response: {response.text}")
                return {"error": "Failed to wol machine"}, response.status_code
        
        except requests.exceptions.RequestException as e:
            # logger.error(f"Request exception: {e}")
            return {"error": "Failed to wol machine"}, 500
        
        except Exception as e:
            # logger.error(f"Unexpected error: {e}")
            return {"error": "Internal server error"}, 500
        
    def get_sensor_data(self):
        return Api().get("/api/sensor")
        
    def apply_rule(self, sensorData, nobreak):
        logger.info("Applying rule...")
        rule = self.rule

        logger.info("Fetching sensor data...")
        humidity = sensorData['data']['data']["humidity"]
        temperature = sensorData['data']['data']["temperature"]
        logger.info(f"Sensor data - Humidity: {humidity}, Temperature: {temperature}")
        if nobreak.batteryCharge is not None:
            isNobreakStatsAvailable = True
        else:
            isNobreakStatsAvailable = False
        isTemperatureLessThanMax = temperature <= rule["maxTemperature"]
        isTemperatureGreaterThanMin = temperature >= rule["minTemperature"]
        isTemperatureOk = isTemperatureGreaterThanMin and isTemperatureLessThanMax
        logger.info(f"Temperature check - isTemperatureOk: {isTemperatureOk}")

        isHumidityOk = humidity < rule["maxHumidity"] and humidity >= rule["minHumidity"]
        logger.info(f"Humidity check - isHumidityOk: {isHumidityOk}")

        shouldShutdown = (
            (not isTemperatureOk or not isHumidityOk)
            or (
                nobreak.batteryCharge is not None
                and rule["chargeToShutdown"] > nobreak.batteryCharge
                and isNobreakStatsAvailable
            )
        ) and self.isOnline
        logger.info(f"Should shutdown: {shouldShutdown}")
        shouldWakeOnLan = shouldWakeOnLan = ( \
                            not self.isOnline\
                            and (\
                                (\
                                    nobreak.batteryCharge is not None\
                                    and rule["chargeToWol"] > nobreak.batteryCharge\
                                    and isNobreakStatsAvailable\
                                )\
                                or (isTemperatureOk and isHumidityOk)\
                            )\
                        )
        logger.info(f"Should wake on LAN: {shouldWakeOnLan}")

        # or rule.forceOnline
        if shouldShutdown:
            logger.info("Initiating shutdown...")
            self.shutdown()
        elif shouldWakeOnLan:
            logger.info("Initiating Wake on LAN...")
            self.wake_on_lan()
        if not self.isOnline and not shouldWakeOnLan:
            logger.info("Machine is offline and no action is needed.")
        # Log output to Redis and emit socketio event
        # self.log_to_redis_and_emit()
        
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