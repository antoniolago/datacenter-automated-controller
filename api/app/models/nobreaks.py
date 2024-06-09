from app import db
from sqlalchemy.orm import relationship
from sqlalchemy import event

class Nobreaks(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=True, unique=True)
    driver = db.Column(db.Text, index=True, unique=False)
    description = db.Column(db.Text, index=True, unique=False)
    port = db.Column(db.Text, index=True, unique=False)
    arguments = relationship("Arguments", cascade="all, delete-orphan", lazy='joined')
    ruleId = db.Column(db.Integer, db.ForeignKey('rules.id'), index=True, unique=False)
    rule = relationship("Rules", backref="nobreak", lazy='joined')
    machines = relationship("Machines", backref="nobreak", lazy='joined')
    
    def __init__(self):
        self.outputVoltage = None
        self.inputVoltage = None
        self.batteryVoltage = None
        self.batteryCharge = None
        self.load = None
        self.isOnline = None
    
    def __repr__(self):
        return '<Nobreaks> {}'.format(self.description)

        
@event.listens_for(Nobreaks.ruleId, 'set')
def propagate_rule_id_value_to_machines(target, value, oldvalue, initiator):
    if value != oldvalue:
        for machine in target.machines:
            if machine.inheritRule:
                machine.ruleId = value