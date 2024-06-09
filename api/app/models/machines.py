from app import db
from sqlalchemy.orm import relationship
from app.models.credentials import Credentials

class Machines(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=False, unique=False)
    description = db.Column(db.Text, index=False, unique=False)
    host = db.Column(db.Text, index=False, unique=True)
    mac = db.Column(db.Text, index=False, unique=True)
    operationalSystemId = db.Column(db.Integer, index=False, unique=False)
    inheritRule = db.Column(db.Boolean, default=True)
    # nobreak = relationship("Nobreaks", backref="machines", lazy='joined')
    nobreakId = db.Column(db.Integer, db.ForeignKey('nobreaks.id', ondelete='SET NULL'), index=True, unique=False)
    # nobreakId = db.Column(db.Integer, db.ForeignKey('nobreaks.id'), index=True, unique=False)

    ruleId = db.Column(db.Integer, db.ForeignKey('rules.id'), index=True, unique=False)
    rule = relationship("Rules", backref="machine", lazy='joined')

    credentialId = db.Column(db.Integer, db.ForeignKey('credentials.id'), index=True, unique=False)
    credential = relationship("Credentials", backref="machine", lazy='joined')

    def __init__(self):
        self.isOnline = None
    def __repr__(self):
        return '<Machines> {}'.format(self.name)
    