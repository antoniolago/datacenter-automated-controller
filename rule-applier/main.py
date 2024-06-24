import pathlib
import sys
from flask import logging 
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))
from shared.api import Api
from ups import Ups
from redis_socketio_handler import RedisSocketioHandler

def return_instantiated_ups_list(upsList):
    instantiatedUpsList = []
    for ups in upsList:
        instantiatedUpsList.append(Ups(ups))
    return instantiatedUpsList

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
handler = RedisSocketioHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)
logger.info("Instantiating Api...")
api = Api()

logger.info("Instantiating Upsses...")
upsList = return_instantiated_ups_list(api.get("/nobreaks"))

for ups in upsList:
    logger.info("Applying rules to " + ups.name + "...")
    ups.apply_rule_to_machines()