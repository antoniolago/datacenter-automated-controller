import logging
from redis_socketio_handler import RedisSocketioHandler
# Initialize logging properly
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
handler = RedisSocketioHandler()
logger.addHandler(handler)
# Initialize logging properly