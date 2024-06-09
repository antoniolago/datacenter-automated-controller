from shared.appsettings import AppSettings
from flasgger import swag_from
from app.util import *
from app import app

@app.route('/appsettings', methods=["GET"])
@swag_from('./swagger/appsettings/get.yml') 
def get_appsettings():
    return AppSettings().__dict__