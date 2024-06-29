from flask_socketio import SocketIO
from app import socketio, app
from app.managers.rule_applier_manager import RuleApplierManager
from shared.appsettings import AppSettings

@socketio.on('updateRuleApplierEvents')
def handle_changeInRuleApplierEvents():
    socketio.on_event(AppSettings().SOCKET_IO_RULE_APPLIER_EVENT, handle_upsdrvctl_event)

def handle_upsdrvctl_event():
    print("test1")

@app.route('/api/rule-applier/output', methods=["GET"])
def get_rule_applier_output():
    return RuleApplierManager().get_rule_applier_output()

with app.app_context():
    handle_changeInRuleApplierEvents()
    