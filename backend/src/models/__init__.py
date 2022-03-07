from server import db
from models.user import createTable as createUserTable
from models.organization import createTable as createOrganizationTable
from models.source import createTable as createSourceTable
from models.log import createTable as createLogTable
from models.flock import createTable as createFlockTable
from models.sample import createTable as createSampleTable
from models.batch import createTable as createBatchTable

organization_source = db.Table('organization-source', db.metadata, db.Column('organization_id', db.Integer, db.ForeignKey('organization.id')), db.Column('source_id', db.Integer, db.ForeignKey('source.id')))

from models.organization import Organization
from models.user import User
from models.batch import Batch
Organization.mainContact = db.Column(db.Integer, db.ForeignKey('user.id'))
Organization.sources = db.relationship('Source', secondary=organization_source, backref = 'organizations')
Batch.entries = db.relationship('Sample', backref=Batch)

createUserTable()
createSourceTable()
createOrganizationTable()
createLogTable()
createFlockTable()
createSampleTable()
createBatchTable()
db.create_all()
