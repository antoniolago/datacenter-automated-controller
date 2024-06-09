from app import db

class Credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    name = db.Column(db.Text, index=False, unique=False)
    user = db.Column(db.Text, index=False, unique=False)
    password = db.Column(db.Text, index=False, unique=False)
    privateKey = db.Column(db.Text, index=False, unique=False)
    publicKey = db.Column(db.Text, index=False, unique=False)

    def __repr__(self):
        return '<Credentials> {}'.format(self.name)