from flask_socketio import SocketIO
from app import socketio, app
from shared.appsettings import AppSettings
from app.managers.nobreak_manager import NobreakManager

@socketio.on('upsdOutputNewLine')
def handle_upsdOutputNewLine(json):
    print("test1:"+json, flush=True)
    
# @socketio.on('updateNobreakEvents')
def handle_changedNobreaks():
    for nobreak in NobreakManager().get_all_nobreaks():
        event_key = AppSettings().SOCKET_IO_UPSDRVCTL_EVENT.replace('{0}', str(nobreak['id']))
        print("Initiating socket for nobreak: "+str(nobreak['id'])+" "+event_key, flush=True)
        socketio.on_event(event_key, handle_upsdrvctl_event)

def handle_upsdrvctl_event(json):
    print("test1:"+json, flush=True)

with app.app_context():
    handle_changedNobreaks()
    