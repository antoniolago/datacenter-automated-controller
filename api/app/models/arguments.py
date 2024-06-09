from app import db
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref
class Arguments(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True, unique=True)
    key = db.Column(db.Text, index=True, unique=True, nullable=False)
    value = db.Column(db.Text, index=True, unique=False, nullable=False)
    nobreakId = db.Column(db.Text, db.ForeignKey('nobreaks.id'), nullable=False)
    # nobreak = relationship("Nobreaks", back_populates="arguments")
    #nobreak = relationship("Nobreaks", back_populates="arguments")
    #nobreak = relationship("Arguments", backref=backref("arguments", cascade="all,delete"))
    
    def __repr__(self):
        return '<Arguments> {}'.format(self.description)