from dataclasses import dataclass
from server import db

from models.organization import Organization
from models.source import Source
from models.enums import Species, BirdGenders, ProductionTypes

@dataclass
class Flock(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(255),unique=True, nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey(Organization.id))
    organization: Organization = db.relationship('Organization')
    strain: str = db.Column(db.String(120))
    species: Species = db.Column(db.Enum(Species), nullable=False)
    production_type: ProductionTypes = db.Column(db.Enum(ProductionTypes), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey(Source.id), nullable=False)
    source: Source = db.relationship('Source')
    gender: BirdGenders = db.Column(db.Enum(BirdGenders), nullable=False)
    
    def __init__(self, requestJSON):
        self.name = requestJSON.get('name')
        self.organization_id = requestJSON.get('organization')
        self.strain = requestJSON.get('strain')
        self.species = requestJSON.get('species')
        self.production_type = requestJSON.get('production_type')
        self.source_id = requestJSON.get('source')
        self.gender = requestJSON.get('gender')
    

def createTable():
    db.create_all()
