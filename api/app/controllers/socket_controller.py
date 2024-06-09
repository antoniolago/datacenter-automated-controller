from flask_socketio import SocketIO
from app import socketio, app
from shared.appsettings import AppSettings
from app.managers.nobreak_manager import NobreakManager

@socketio.on('upsdOutputNewLine')
def handle_upsdOutputNewLine():
    print("test1")
    
@socketio.on('updateNobreakEvents')
def handle_changedNobreaks():
    for nobreak in NobreakManager().get_all_nobreaks():
        print(nobreak)
        socketio.on_event(AppSettings().SOCKET_IO_UPSDRVCTL_EVENT.replace('{0}', str(nobreak['id'])), handle_upsdrvctl_event)

def handle_upsdrvctl_event():
    print("test1")

with app.app_context():
    handle_changedNobreaks()
    