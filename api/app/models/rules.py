from app import db

class Rules(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=False, unique=False)
    description = db.Column(db.Text, index=False, unique=False)
    minTemperature = db.Column(db.Float, index=False, unique=False)
    maxTemperature = db.Column(db.Float, index=False, unique=True)
    minHumidity = db.Column(db.Float, index=False, unique=True)
    maxHumidity = db.Column(db.Float, index=False, unique=False)
    forceOnline = db.Column(db.Integer, index=False, unique=False)
    wolAttempts = db.Column(db.Integer, index=False, unique=False)
    chargeToShutdown = db.Column(db.Float, index=False, unique=False)
    chargeToWol = db.Column(db.Float, index=False, unique=False)

    def __repr__(self):
        return '<Rules> {}'.format(self.name)