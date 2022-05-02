#This test file is intended to generate coverage for model functions.
from flask_sqlalchemy import SQLAlchemy
import pytest 
import os
import sys
from requests import request
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src import Models
print(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from src.enums import Roles
import bcrypt

db = SQLAlchemy()

def test_register_admin_backend():
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    # temp2 = requests.get(url = url, params = temp)
    # data = json.load(temp2.json())
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    assert user.email == "administrator@ncsu.edu"
    assert user.first_name == "gavin"
    assert user.last_name == "dacier"
    assert user.role == Roles.Admin
    
def test_register_collector_backend():
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="collector@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Data_Collector,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Data_Collector )
    assert user.email == "collector@ncsu.edu"
    assert user.first_name == "gavin"
    assert user.last_name == "dacier"
    assert user.role == Roles.Data_Collector
    
    
def test_add_organization_backend():
    db.Model
    temp = dict(
        id = 12345,
        name = "Duke University",
        street_address = "123 Blue Devil Ave",
        city = "Durham",
        state = "North Carolina",
        zip = "27708",
        notes = "basketball school",
        organization_code = "999999",
        )
    
    data=temp
    organization = Models.Organization(id=data["id"], name=data["name"], street_address=data["street_address"], city = data["city"], state=data["state"], zip = data["zip"], notes = data["notes"], organization_code = data["organization_code"] )
    assert organization.id == 12345
    assert organization.name == "Duke University"
    assert organization.street_address == "123 Blue Devil Ave"
    assert organization.city == "Durham"
    assert organization.state == "North Carolina"
    assert organization.zip == "27708"
    assert organization.notes == "basketball school"
    assert organization.organization_code == "999999"
