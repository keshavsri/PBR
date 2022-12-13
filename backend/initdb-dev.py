from src.models import *
from src import app
import sys
import traceback
from sqlalchemy.sql import text
from sqlalchemy import MetaData


import bcrypt

with app.app_context():
    # Create an Organization
    org = Organization(
        name="Test Org",
        street_address="919 Rainbow Rd",
        city="Raleigh",
        state="NC",
        zip="27606",
        organization_code="000000"
    )
    db.session.add(org)
    db.session.commit()
    db.session.refresh(org)

    salt = bcrypt.gensalt()
    pw = "000000"

    # Create a Admin
    admin = User(
        email="admin@email.com",
        password=bcrypt.hashpw(pw.encode('utf8'), salt),
        first_name="Ad",
        last_name="Min",
        role="Admin",
        organization_id=org.id
    )
    db.session.add(admin)
    db.session.commit()

    # Create a Supervisor
    supervisor = User(
        email="supervisor@email.com",
        password=bcrypt.hashpw(pw.encode('utf8'), salt),
        first_name="Super",
        last_name="Visor",
        role="Supervisor",
        organization_id=org.id
    )
    db.session.add(supervisor)
    db.session.commit()

    # Create a Data Collector
    data_collector = User(
        email="datacollector@email.com",
        password=bcrypt.hashpw(pw.encode('utf8'), salt),
        first_name="Data",
        last_name="Collector",
        role="Data_Collector",
        organization_id=org.id
    )
    db.session.add(data_collector)
    db.session.commit()

    # Create a Data Collector
    guest = User(
        email="guest@email.com",
        password=bcrypt.hashpw(pw.encode('utf8'), salt),
        first_name="Gue",
        last_name="St",
        role="Guest",
        organization_id=org.id
    )
    db.session.add(guest)
    db.session.commit()

    # Create a Source
    source = Source(
        name="Test Source",
        street_address="123 Sesame St",
        city="Raleigh",
        state="NC",
        zip="27603",
        organization_id=org.id
    )
    db.session.add(source)
    db.session.commit()
    db.session.refresh(source)

    # Create a Test Flock 
    flock = Flock(
        name="Test Flock",
        strain="Maran",
        species="Turkey",
        gender="Female",
        production_type="Meat",
        birthday="2006-07-24 00:00:00",
        source_id=source.id
    )
    db.session.add(flock)
    db.session.commit()

    # Create Machines from Machine Types for Test Org
    istat= Machine(
        serial_number=135790,
        machine_type_id=1,
        organization_id=org.id
    )
    db.session.add(istat)
    db.session.commit()

    vetscan= Machine(
        serial_number=24680,
        machine_type_id=2,
        organization_id=org.id
    )
    db.session.add(vetscan)
    db.session.commit()
