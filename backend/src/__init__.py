from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from src.api import apiBlueprint
from src.api.APIUserController import userBlueprint
from src.api.APIDataController import sampleBlueprint
from src.api.APIOrganizationController import organizationBlueprint
from src.api.APILogController import logBlueprint
from src.api.APIFlockController import flockBlueprint
from src.api.APIDataController import sampleBlueprint
from src.api.APIMachineController import machineBlueprint
from src.api.APIMeasurementController import measurementBlueprint
from src.api.APIDataController import sampleBlueprint
import os
from dotenv import load_dotenv, find_dotenv
from flask.cli import with_appcontext
import click

load_dotenv(find_dotenv())


app = Flask(__name__)
app.register_blueprint(apiBlueprint, url_prefix='/api')
app.register_blueprint(userBlueprint, url_prefix='/api/user')
app.register_blueprint(organizationBlueprint, url_prefix='/api/organization')
app.register_blueprint(logBlueprint, url_prefix='/api/log')
app.register_blueprint(flockBlueprint, url_prefix='/api/flock')
app.register_blueprint(sampleBlueprint, url_prefix='/api/sample')
app.register_blueprint(machineBlueprint, url_prefix='/api/machine')
app.register_blueprint(measurementBlueprint, url_prefix='/api/measurement')
app.config['SECRET_KEY'] = os.environ.get("JWT_SECRET")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")


from src import Models

@click.command()
@with_appcontext
def init_test_dev_db():
    """Initializes the testing and development database."""

    print("Creating database tables...")

    print(os.getenv("DB_USER"))
    print(os.getenv("DB_PASS"))
    print(os.getenv("DB_HOST"))
    print(os.getenv("DB_NAME"))
    print(os.getenv("DATABASE_URL"))
    Models.db.create_all()
    print("Done!")

    print("Initializing database with data...")

    # Create an Organization
    ncsu_org = Models.Organization(
        id=1,
        name="North Carolina State University",
        street_address="1210 Varsity Drive",
        city="Raleigh",
        state="NC",
        zip="27606",
        organization_code="123456"
    )

    Models.db.session.add(ncsu_org)
    Models.db.commit()

    # Create a Super Admin
    super_admin_user = Models.User(
        email=os.getenv("SUPERADMIN_EMAIL"),
        password=os.getenv("SUPERADMIN_PASSWORD"),
        first_name="SUPER",
        last_name="ADMIN",
        role="SUPER_ADMIN",
        organization_id=1
    )

    Models.db.session.add(super_admin_user)
    Models.db.commit()

    # Create a Source
    lake_wheeler_source = Models.Source(
        id=1,
        name="Lake Wheeler",
        street_address="4201 Inwood Road",
        city="Raleigh",
        state="NC",
        zip="27603"
    )

    Models.db.session.add(lake_wheeler_source)
    Models.db.commit()

    # Link Source with Organization
    lakewheeler_ncsu = Models.OrganizationSource(
        organization_id=1,
        source_id=1
    )

    Models.db.session.add(lakewheeler_ncsu)
    Models.db.commit()
    
    # Create a Test Flock 
    test_flock = Models.Flock(
        id=1,
        name="Test Flock",
        strain="Ross 708",
        species="Chicken",
        gender="Male",
        production_type="Meat",
        source_id=1,
        organization_id=1
    )

    Models.db.session.add(test_flock)
    Models.db.commit()

    # Load in Machine Types
    istat_machinetype = Models.MachineType(
        id=1,
        name="iStat",
    )

    Models.db.session.add(istat_machinetype)
    Models.db.commit()

    vetscan_machinetype = Models.MachineType(
        id=2,
        name="VetScan VS2",
    )

    Models.db.session.add(vetscan_machinetype)
    Models.db.commit()

    # Create Machines from Machine Types for NCSU
    ncsu_istat= Models.Machine(
        id=1,
        serial_number=123456,
        machinetype_id=1,
        organization_id=1
    )

    Models.db.session.add(ncsu_istat)
    Models.db.commit()

    ncsu_vetscan= Models.Machine(
        id=2,
        serial_number=654321,
        machinetype_id=2,
        organization_id=1
    )

    Models.db.session.add(ncsu_vetscan)
    Models.db.commit()

    # Load in Measurement Types 
    mt1 = Models.MeasurementType(
        id=1,
        abbreviation="AST",
        units="U/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt1)

    mt2 = Models.MeasurementType(
        id=2,
        abbreviation="BA",
        units="umol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt2)

    mt3 = Models.MeasurementType(
        id=3,
        abbreviation="CK",
        units="U/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt3)

    mt4 = Models.MeasurementType(
        id=4,
        abbreviation="UA",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt4)

    mt5 = Models.MeasurementType(
        id=5,
        name="Glucose",
        abbreviation="GLU",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt5)

    mt6 = Models.MeasurementType(
        id=6,
        name="Total Calcium",
        abbreviation="CA",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt6)

    mt7 = Models.MeasurementType(
        id=7,
        name="Phosphorus",
        abbreviation="PHOS",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt7)

    mt8 = Models.MeasurementType(
        id=8,
        name="Total Protein",
        abbreviation="TP",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt8)
    
    mt9 = Models.MeasurementType(
        id=9,
        name="Albumen",
        abbreviation="ALB",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt9)

    mt10 = Models.MeasurementType(
        id=10,
        name="Globulin",
        abbreviation="GLOB",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt10)

    mt11 = Models.MeasurementType(
        id=11,
        name="Potassium",
        abbreviation="K+",
        units="mmol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt11)

    mt12 = Models.MeasurementType(
        id=12,
        name="Sodium",
        abbreviation="NA+",
        units="mmol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt12)

    mt13 = Models.MeasurementType(
        id=13,
        name="RQC",
        required=0,
        general=0
    )
    Models.db.session.add(mt13)

    mt14 = Models.MeasurementType(
        id=14,
        name="QC",
        required=0,
        general=0
    )
    Models.db.session.add(mt14)

    mt15 = Models.MeasurementType(
        id=15,
        name="HEM",
        required=0,
        general=0
    )
    Models.db.session.add(mt15)

    mt16 = Models.MeasurementType(
        id=16,
        name="LIP",
        required=0,
        general=0
    )
    Models.db.session.add(mt16)

    mt17 = Models.MeasurementType(
        id=17,
        name="ICT",
        required=0,
        general=0
    )
    Models.db.session.add(mt17)

    mt18 = Models.MeasurementType(
        id=18,
        name="Rotor Lot Number",
        required=0,
        general=1
    )
    Models.db.session.add(mt18)

    mt19 = Models.MeasurementType(
        id=19,
        name="Patient ID",
        required=0,
        general=1
    )
    Models.db.session.add(mt19)

    mt20 = Models.MeasurementType(
        id=20,
        abbreviation="pH",
        required=0,
        general=0
    )
    Models.db.session.add(mt20)

    mt21 = Models.MeasurementType(
        id=21,
        abbreviation="pCO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt21)

    mt22 = Models.MeasurementType(
        id=22,
        abbreviation="pO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt22)

    mt23 = Models.MeasurementType(
        id=23,
        abbreviation="BE",
        required=0,
        general=0
    )
    Models.db.session.add(mt23)

    mt24 = Models.MeasurementType(
        id=24,
        abbreviation="HCO3",
        required=0,
        general=0
    )
    Models.db.session.add(mt24)

    mt25 = Models.MeasurementType(
        id=25,
        abbreviation="tCO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt25)

    mt26 = Models.MeasurementType(
        id=26,
        abbreviation="sO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt26)

    mt27 = Models.MeasurementType(
        id=27,
        abbreviation="Na",
        required=0,
        general=0
    )
    Models.db.session.add(mt27)

    mt28 = Models.MeasurementType(
        id=28,
        abbreviation="K",
        required=0,
        general=0
    )
    Models.db.session.add(mt28)

    mt29 = Models.MeasurementType(
        id=29,
        abbreviation="iCa",
        required=0,
        general=0
    )
    Models.db.session.add(mt29)

    mt30 = Models.MeasurementType(
        id=30,
        abbreviation="Glu",
        required=0,
        general=0
    )
    Models.db.session.add(mt30)

    mt31 = Models.MeasurementType(
        id=31,
        abbreviation="Hct",
        required=0,
        general=0
    )
    Models.db.session.add(mt31)

    mt32 = Models.MeasurementType(
        id=32,
        abbreviation="Hb",
        required=0,
        general=0
    )
    Models.db.session.add(mt32)

    mt33 = Models.MeasurementType(
        id=33,
        name="iStat Number",
        required=0,
        general=1
    )
    Models.db.session.add(mt33)
    Models.db.commit()
    
    # Link Measurement Types to Machines
    for i in range(1, 20):
        Models.db.session.add(
            Models.Measurement(
                machine_id=2,
                measurementtype_id=i
            )
        )
    for i in range(20, 34):
        Models.db.session.add(
            Models.Measurement(
                machine_id=1,
                measurementtype_id=i
            )
        )
    Models.db.commit()
    print("Done!")
    

@click.command()
@with_appcontext
def init_prod_db():
    """Initializes the testing and development database."""

    print("Creating database tables...")

    print(os.getenv("DB_USER"))
    print(os.getenv("DB_PASS"))
    print(os.getenv("DB_HOST"))
    print(os.getenv("DB_NAME"))
    print(os.getenv("DATABASE_URL"))
    Models.db.create_all()
    print("Done!")

    print("Initializing database with data...")

    # Create an Organization
    ncsu_org = Models.Organization(
        id=1,
        name="North Carolina State University CVM",
        street_address="1060 William Moore Dr",
        city="Raleigh",
        state="NC",
        zip="27606",
        organization_code="123456"
    )

    Models.db.session.add(ncsu_org)
    Models.db.commit()

    # Create a Super Admin
    super_admin_user = Models.User(
        email=os.getenv("SUPERADMIN_EMAIL"),
        password=os.getenv("SUPERADMIN_PASSWORD"),
        first_name="SUPER",
        last_name="ADMIN",
        role="SUPER_ADMIN",
        organization_id=1
    )

    Models.db.session.add(super_admin_user)
    Models.db.commit()

    # Load in Machine Types
    istat_machinetype = Models.MachineType(
        id=1,
        name="iStat",
    )

    Models.db.session.add(istat_machinetype)
    Models.db.commit()

    vetscan_machinetype = Models.MachineType(
        id=2,
        name="VetScan VS2",
    )

    Models.db.session.add(vetscan_machinetype)
    Models.db.commit()

    # Create Machines from Machine Types for NCSU
    ncsu_istat = Models.Machine(
        id=1,
        serial_number=123456,
        machinetype_id=1,
        organization_id=1
    )

    Models.db.session.add(ncsu_istat)
    Models.db.commit()

    ncsu_vetscan = Models.Machine(
        id=2,
        serial_number=654321,
        machinetype_id=2,
        organization_id=1
    )

    Models.db.session.add(ncsu_vetscan)
    Models.db.commit()

    # Load in Measurement Types
    mt1 = Models.MeasurementType(
        id=1,
        abbreviation="AST",
        units="U/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt1)

    mt2 = Models.MeasurementType(
        id=2,
        abbreviation="BA",
        units="umol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt2)

    mt3 = Models.MeasurementType(
        id=3,
        abbreviation="CK",
        units="U/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt3)

    mt4 = Models.MeasurementType(
        id=4,
        abbreviation="UA",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt4)

    mt5 = Models.MeasurementType(
        id=5,
        name="Glucose",
        abbreviation="GLU",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt5)

    mt6 = Models.MeasurementType(
        id=6,
        name="Total Calcium",
        abbreviation="CA",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt6)

    mt7 = Models.MeasurementType(
        id=7,
        name="Phosphorus",
        abbreviation="PHOS",
        units="mg/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt7)

    mt8 = Models.MeasurementType(
        id=8,
        name="Total Protein",
        abbreviation="TP",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt8)

    mt9 = Models.MeasurementType(
        id=9,
        name="Albumen",
        abbreviation="ALB",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt9)

    mt10 = Models.MeasurementType(
        id=10,
        name="Globulin",
        abbreviation="GLOB",
        units="g/dL",
        required=0,
        general=0
    )
    Models.db.session.add(mt10)

    mt11 = Models.MeasurementType(
        id=11,
        name="Potassium",
        abbreviation="K+",
        units="mmol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt11)

    mt12 = Models.MeasurementType(
        id=12,
        name="Sodium",
        abbreviation="NA+",
        units="mmol/L",
        required=0,
        general=0
    )
    Models.db.session.add(mt12)

    mt13 = Models.MeasurementType(
        id=13,
        name="RQC",
        required=0,
        general=0
    )
    Models.db.session.add(mt13)

    mt14 = Models.MeasurementType(
        id=14,
        name="QC",
        required=0,
        general=0
    )
    Models.db.session.add(mt14)

    mt15 = Models.MeasurementType(
        id=15,
        name="HEM",
        required=0,
        general=0
    )
    Models.db.session.add(mt15)

    mt16 = Models.MeasurementType(
        id=16,
        name="LIP",
        required=0,
        general=0
    )
    Models.db.session.add(mt16)

    mt17 = Models.MeasurementType(
        id=17,
        name="ICT",
        required=0,
        general=0
    )
    Models.db.session.add(mt17)

    mt18 = Models.MeasurementType(
        id=18,
        name="Rotor Lot Number",
        required=0,
        general=1
    )
    Models.db.session.add(mt18)

    mt19 = Models.MeasurementType(
        id=19,
        name="Patient ID",
        required=0,
        general=1
    )
    Models.db.session.add(mt19)

    mt20 = Models.MeasurementType(
        id=20,
        abbreviation="pH",
        required=0,
        general=0
    )
    Models.db.session.add(mt20)

    mt21 = Models.MeasurementType(
        id=21,
        abbreviation="pCO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt21)

    mt22 = Models.MeasurementType(
        id=22,
        abbreviation="pO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt22)

    mt23 = Models.MeasurementType(
        id=23,
        abbreviation="BE",
        required=0,
        general=0
    )
    Models.db.session.add(mt23)

    mt24 = Models.MeasurementType(
        id=24,
        abbreviation="HCO3",
        required=0,
        general=0
    )
    Models.db.session.add(mt24)

    mt25 = Models.MeasurementType(
        id=25,
        abbreviation="tCO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt25)

    mt26 = Models.MeasurementType(
        id=26,
        abbreviation="sO2",
        required=0,
        general=0
    )
    Models.db.session.add(mt26)

    mt27 = Models.MeasurementType(
        id=27,
        abbreviation="Na",
        required=0,
        general=0
    )
    Models.db.session.add(mt27)

    mt28 = Models.MeasurementType(
        id=28,
        abbreviation="K",
        required=0,
        general=0
    )
    Models.db.session.add(mt28)

    mt29 = Models.MeasurementType(
        id=29,
        abbreviation="iCa",
        required=0,
        general=0
    )
    Models.db.session.add(mt29)

    mt30 = Models.MeasurementType(
        id=30,
        abbreviation="Glu",
        required=0,
        general=0
    )
    Models.db.session.add(mt30)

    mt31 = Models.MeasurementType(
        id=31,
        abbreviation="Hct",
        required=0,
        general=0
    )
    Models.db.session.add(mt31)

    mt32 = Models.MeasurementType(
        id=32,
        abbreviation="Hb",
        required=0,
        general=0
    )
    Models.db.session.add(mt32)

    mt33 = Models.MeasurementType(
        id=33,
        name="iStat Number",
        required=0,
        general=1
    )
    Models.db.session.add(mt33)
    Models.db.commit()

    # Link Measurement Types to Machines
    for i in range(1, 20):
        Models.db.session.add(
            Models.Measurement(
                machine_id=2,
                measurementtype_id=i
            )
        )
    for i in range(20, 34):
        Models.db.session.add(
            Models.Measurement(
                machine_id=1,
                measurementtype_id=i
            )
        )
    Models.db.commit()
    print("Done!")


app.cli.add_command(init_test_dev_db)
app.cli.add_command(init_prod_db)
Models.db.init_app(app)