from server import db
from models.user import createTable as createUserTable
from models.organization import createTable as createOrganizationTable
from models.source import createTable as createSourceTable

organization_source = db.Table('organization-source', db.metadata, db.Column('organization_id', db.Integer, db.ForeignKey('organization.id')), db.Column('source_id', db.Integer, db.ForeignKey('source.id')))

from models.organization import Organization

Organization.sources = db.relationship('Source', secondary=organization_source, backref = 'organizations')

createUserTable()
createSourceTable()
createOrganizationTable()
db.create_all()
