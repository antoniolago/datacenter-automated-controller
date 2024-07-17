from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
# from shared import *
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_socketio import SocketIO
import sys
import pathlib
from sqlalchemy_utils import database_exists, create_database
_parentdir = pathlib.Path(__file__).parent.parent.parent.resolve()
sys.path.insert(0, str(_parentdir))

from shared.appsettings import AppSettings


app = Flask(__name__)
swagger = Swagger(app)
app.config.from_object(AppSettings())
app.config["REDIS_URL"] = app.config["REDIS_URL"]
app.config['APPLICATION_ROOT'] = '/api'
app.config['SECRET_KEY'] = 'secret!'
# app.config['DEBUG'] = True
socketio = SocketIO(
                        app, 
                        message_queue=app.config["REDIS_URL"], 
                        cors_allowed_origins='*',
                        logger=True, 
                        engineio_logger=True
                    )

api_v1_cors_config = {"origins": ["http://localhost:8090", "localhost:8090", "snp0:8090", "http://snp0:8090"]}
CORS(app, resources={"/*": api_v1_cors_config})

db = SQLAlchemy(app)
migrate = Migrate(app, db, command='migrate')

from app.models import models
with app.app_context():
    if not database_exists(db.engine.url): create_database(db.engine.url)
    db.create_all()
    db.session.commit()
from app.controllers import routes