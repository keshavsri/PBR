from server import db
from enums import Bird_Gender


class Flock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    associated_organization = db.relationship('Organization', backref='flock')
    strain = db.Column(db.String(120))
    species = db.Column(db.String(120))
    gender = db.Column(db.Integer)
    source = db.relationship('Source', backref='flock')
    production_type = db.Column(db.String(120))

    def __init__(self, associated_organization,strain,species,gender,source,production_type):
        self.associated_organization = associated_organization
        self.strain = strain
        self.species = species
        self.gender = gender
        self.source = source
        self.production_type = production_type
