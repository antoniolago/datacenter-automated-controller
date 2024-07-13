import logging
import os
import pathlib
import sys
import time

dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)
from shared.api import Api
from logger import logger
from ups import Ups, return_instantiated_ups_list
while True: 
    logger.info("Instantiating Api...")
    api = Api()

    logger.info("Instantiating UPSs...")
    #validate api response
    nobreakResponse = api.get("/nobreaks")
    if not nobreakResponse:
        logger.error("Failed to get UPSs")
        pass
    upsList = return_instantiated_ups_list(nobreakResponse)

    logger.info("UPSs found: " + str(len(upsList)))
    logger.info("Getting sensor data...")
    sensorResponse = api.get("/sensor/0")
    logger.info(f"Temperature: {sensorResponse['data']['temperature']} - Humidity: {sensorResponse['data']['humidity']}")
    #describe each ups
    for ups in upsList:
        logger.info(f"=======================UPS {ups.name} START =======================")
        if not ups.machines:
            logger.info(f"No machines vinculated to ups \"{ups.name}\"")
            logger.info(f"=======================UPS {ups.name} END =======================")
            continue
        logger.info(f"Checking rules to machines vinculated to ups \"{ups.name}\"...")
        for machine in ups.machines:
            logger.info(f"-----------------{machine.name} - {machine.description}--------------")
            logger.info(f"Machine {machine.name} - {machine.description}")
            logger.info(f"Machine {machine.name} is online: {machine.isOnline}")
            logger.info(f"Applying rule to machine {machine.name}...")
            machine.apply_rule(sensorResponse, ups)
            logger.info(f"-----------------{machine.name} - {machine.description}--------------")
        logger.info(f"=======================UPS {ups.name} END =======================")
    
    logger.info("...")
    time.sleep(5)