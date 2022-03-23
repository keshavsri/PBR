from server import db
from models.enums import Roles
from flask_serialize import FlaskSerialize
from models.enums import Roles

fs_mixin = FlaskSerialize(db)

class User(db.Model, fs_mixin):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    # organization = db.Column(db.Integer, db.ForeignKey('organization.id'))
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(120))
    first_name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    role = db.Column(db.Enum(Roles), nullable=True)
    notes = db.Column(db.String(500))
    
    __fs_create_fields__ = __fs_update_fields__ = ['email', 'password', 'first_name', 'last_name', 'role', 'notes']
    
    def __repr__(self):
        return f'id: {self.id}, email: {self.email}, password: {self.password}, first_name: {self.first_name}, last_name: {self.last_name}, role: {self.role}, notes: {self.notes}'

def createTable():
    db.create_all()