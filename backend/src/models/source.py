from server import db
from enums import States

class Source(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), index=True, unique=True)
    street_address = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(20))
    zip = db.Column(db.String(10))
    
    def __init__(self, name, street_address,city,state,zip):
        self.name = name
        self.street_address = street_address
        self.city = city
        self.state = state
        self.zip = zip


