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
    machines = relationship("Machines", cascade="all, delete-orphan", lazy='joined')
    
    def __init__(self):
        self.outputVoltage = None
        self.inputVoltage = None
        self.batteryVoltage = None
        self.batteryCharge = None
        self.load = None
        self.isOnline = None
    
    @property
    def outputVoltage(self):
        return self.__outputVoltage
    
    @outputVoltage.setter
    def outputVoltage(self, value):
        self.__outputVoltage = value

    @property
    def inputVoltage(self):
        return self.__inputVoltage
    
    @inputVoltage.setter
    def inputVoltage(self, value):
        self.__inputVoltage = value

    @property
    def batteryVoltage(self):
        return self.__batteryVoltage
    
    @batteryVoltage.setter
    def batteryVoltage(self, value):
        self.__batteryVoltage = value

    @property
    def batteryCharge(self):
        return self.__batteryCharge
    
    @batteryCharge.setter
    def batteryCharge(self, value):
        self.__batteryCharge = value

    @property
    def load(self):
        return self.__load
    
    @load.setter
    def load(self, value):
        self.__load = value

    @property
    def isOnline(self):
        return self.__isOnline
    
    @isOnline.setter
    def isOnline(self, value):
        self.__isOnline = value
    
    def __repr__(self):
        return '<Nobreaks> {}'.format(self.description)
        
@event.listens_for(Nobreaks.ruleId, 'set')
def propagate_rule_id_value_to_machines(target, value, oldvalue, initiator):
    if value != oldvalue:
        for machine in target.machines:
            if machine.inheritRule:
                machine.ruleId = value
