import socket
from app import db
from ping3 import ping, verbose_ping
from sqlalchemy.orm import relationship
from app.models.credentials import Credentials
from sqlalchemy.ext.hybrid import hybrid_method
from sqlalchemy.ext.hybrid import hybrid_property

def is_machine_online(ip_address):
    try:
        pingResponse = ping(ip_address)
        if(pingResponse):
            return True
        else:
            return False
        # # Create a socket connection
        # s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # s.settimeout(1)  # Timeout after 1 second
        
        # s.connect((ip_address, port))
        # s.close()
    except (socket.timeout, socket.error):
        return False
class Machines(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=False, unique=False)
    description = db.Column(db.Text, index=False, unique=False)
    host = db.Column(db.Text, index=False, unique=True)
    mac = db.Column(db.Text, index=False, unique=True)
    operationalSystemId = db.Column(db.Integer, index=False, unique=False)
    inheritRule = db.Column(db.Boolean, default=True)
    # nobreak = relationship("Nobreaks", backref="machines", lazy='joined')
    nobreakId = db.Column(db.Text, db.ForeignKey('nobreaks.id', ondelete='SET NULL'), index=True, unique=False)
    # nobreakId = db.Column(db.Integer, db.ForeignKey('nobreaks.id'), index=True, unique=False)

    ruleId = db.Column(db.Integer, db.ForeignKey('rules.id'), index=True, unique=False)
    rule = relationship("Rules", backref="machine", lazy='joined')
    # isOnline = is_machine_online(host)
    credentialId = db.Column(db.Integer, db.ForeignKey('credentials.id'), index=True, unique=False)
    credential = relationship("Credentials", backref="machine", lazy='joined')

    def __init__(self):
        self.isOnline = None

    def __repr__(self):
        return '<Machines> {}'.format(self.name)