from src.models import *
from src import app
from sqlalchemy import text

import sys
import bcrypt
import traceback
from sqlalchemy.sql import text
from sqlalchemy import MetaData



if len(sys.argv) != 3:
    print("Invalid number of Arguments! Usage: initdb su_username su_password")
else:
    with app.app_context():
        """Initializes the database."""
        engine = create_engine(os.environ.get("DATABASE_URL"))
        db.create_all()
        if db.session:
            meta = db.metadata
            for table in reversed(meta.sorted_tables):
                db.session.execute(table.delete())
            db.session.commit()

        print("Creating database tables...")
        db.create_all()

        print("Initializing default values...")

        try:
            # Create an Organization
            ncsu_org = Organization(
                id=1,
                name="North Carolina State University",
                street_address="1210 Varsity Drive",
                city="Raleigh",
                state="NC",
                zip="27606",
                organization_code="123456"
            )
            db.session.add(ncsu_org)
            db.session.commit()

            salt = bcrypt.gensalt()
            hashedPW = bcrypt.hashpw(sys.argv[2].encode('utf8'), salt)

            # Create a Super Admin
            super_admin_user = User(
                email=sys.argv[1],
                password=hashedPW,
                first_name="SUPER",
                last_name="ADMIN",
                role="Super_Admin",
                organization_id=1
            )

            db.session.add(super_admin_user)
            db.session.commit()
            # Create a Source
            lake_wheeler_source = Source(
                id=1,
                name="Lake Wheeler",
                street_address="4201 Inwood Road",
                city="Raleigh",
                state="NC",
                zip="27603",
                organization_id=1
            )

            db.session.add(lake_wheeler_source)
            db.session.commit()

            # Create a Test Flock 
            test_flock = Flock(
                id=1,
                name="Test Flock",
                strain="Ross 708",
                species="Chicken",
                gender="Male",
                production_type="Meat",
                source_id=1
            )

            db.session.add(test_flock)
            db.session.commit()

            # Load in Machine Types
            istat_machinetype = MachineType(
                id=1,
                name="iStat",
            )

            db.session.add(istat_machinetype)
            db.session.commit()

            vetscan_machinetype = MachineType(
                id=2,
                name="VetScan VS2",
            )

            db.session.add(vetscan_machinetype)
            db.session.commit()
            # Create Machines from Machine Types for NCSU
            ncsu_istat= Machine(
                id=1,
                serial_number=123456,
                machine_type_id=1,
                organization_id=1
            )

            db.session.add(ncsu_istat)
            db.session.commit()

            ncsu_vetscan= Machine(
                id=2,
                serial_number=654321,
                machine_type_id=2,
                organization_id=1
            )

            db.session.add(ncsu_vetscan)
            db.session.commit()

            # Load in Measurement Types 
            mt1 = Analyte(
                id=1,
                abbreviation="AST",
                units="U/L",
                machine_type_id=2,
                name="Aspartate Aminotransferase"

            )
            db.session.add(mt1)

            mt2 = Analyte(
                id=2,
                abbreviation="BA",
                units="umol/L",
                machine_type_id=2,
                name="Bile Acid"
            )
            db.session.add(mt2)

            mt3 = Analyte(
                id=3,
                abbreviation="CK",
                units="U/L",
                machine_type_id=2,
                name="Creatinine Kinase"
            )
            db.session.add(mt3)

            mt4 = Analyte(
                id=4,
                abbreviation="UA",
                units="mg/dL",
                machine_type_id=2,
                name="Uric Acid"
            )
            db.session.add(mt4)

            mt5 = Analyte(
                id=5,
                name="Glucose",
                abbreviation="GLU",
                units="mg/dL",
                machine_type_id=2


            )
            db.session.add(mt5)

            mt6 = Analyte(
                id=6,
                name="Phosphorus",
                abbreviation="PHOS",
                units="mg/dL",
                machine_type_id=2
            )
            db.session.add(mt6)

            mt7 = Analyte(
                id=7,
                name="Total Calcium",
                abbreviation="CA",
                units="mg/dL",
                machine_type_id=2,
            )
            db.session.add(mt7)

            mt8 = Analyte(
                id=8,
                name="Total Protein",
                abbreviation="TP",
                units="g/dL",
                machine_type_id=2
            )
            db.session.add(mt8)

            mt9 = Analyte(
                id=9,
                name="Albumen",
                abbreviation="ALB",
                units="g/dL",
                machine_type_id=2
            )
            db.session.add(mt9)

            mt10 = Analyte(
                id=10,
                name="Globulin",
                abbreviation="GLOB",
                units="g/dL",
                machine_type_id=2

            )
            db.session.add(mt10)

            mt11 = Analyte(
                id=11,
                name="Potassium",
                abbreviation="K+",
                units="mmol/L",
                machine_type_id=2


            )
            db.session.add(mt11)

            mt12 = Analyte(
                id=12,
                name="Sodium",
                abbreviation="NA+",
                units="mmol/L",
                machine_type_id=2

            )
            db.session.add(mt12)

            mt13 = Analyte(
                id=13,
                name="Sodium",
                abbreviation="Na",
                units="mmol/L",
                machine_type_id=1

            )
            db.session.add(mt13)

            mt14 = Analyte(
                id=14,
                name="Potassium",
                abbreviation="K",
                units="mmol/L",
                machine_type_id=1

            )
            db.session.add(mt14)

            mt15 = Analyte(
                id=15,
                name="Ionized Calcium",
                abbreviation="iCa",
                units="mmol/L",
                machine_type_id=1

            )
            db.session.add(mt15)

            mt16 = Analyte(
                id=16,
                name="Hematocrit",
                abbreviation="Hct",
                units="%PCV",
                machine_type_id=1

            )
            db.session.add(mt16)

            mt17 = Analyte(
                id=17,
                name="Hemoglobin",
                abbreviation="Hgb",
                units="mmol/L",
                machine_type_id=1

            )
            db.session.add(mt17)

            mt18 = Analyte(
                id=18,
                abbreviation="pH",
                machine_type_id=1,
                name="pH"

            )
            db.session.add(mt18)


            mt19 = Analyte(
                id=19,
                abbreviation="PO2",
                machine_type_id=1,
                units="mmol/L",
                name="PO2"

            )
            db.session.add(mt19)

            mt20 = Analyte(
                id=20,
                abbreviation="TCO2",
                machine_type_id=1,
                units="mmol/L",
                name="TCO2"

            )
            db.session.add(mt20)

            mt21 = Analyte(
                id=21,
                abbreviation="HCO3",
                machine_type_id=1,
                units="mmol/L",
                name="HCO3"

            )
            db.session.add(mt21)

            mt22 = Analyte(
                id=22,
                name="Base Excess",
                abbreviation="BE",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt22)

            mt23 = Analyte(
                id=23,
                abbreviation="sO2",
                machine_type_id=1,
                units="%",
                name="sO2"

            )
            db.session.add(mt23)

            mt24 = Analyte(
                id=24,
                name="Chloride",
                abbreviation="Cl",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt24)

            mt25 = Analyte(
                id=25,
                name="Anion Gap",
                abbreviation="Cl",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt25)

            mt26 = Analyte(
                id=26,
                name="BUN/Urea",
                abbreviation="BUN/Urea",
                machine_type_id=1,
                units="mg/dL"

            )
            db.session.add(mt26)

            mt27 = Analyte(
                id=27,
                name="Urea Nitrogen",
                abbreviation="BUN",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt27)

            mt28 = Analyte(
                id=28,
                name="Creatinine",
                abbreviation="Crea",
                machine_type_id=1,
                units="umol/L"

            )
            db.session.add(mt28)

            mt29 = Analyte(
                id=29,
                abbreviation="PCO2",
                name="PCO2",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt29)

            mt30 = Analyte(
                id=30,
                name="Glucose",
                abbreviation="Glu",
                machine_type_id=1,
                units="mmol/L"

            )
            db.session.add(mt30)
            db.session.commit()

            c1 = CartridgeType(
                id=1,
                machine_type_id=2,
                name="VetScan - Avian/Reptilian Profile Plus Cartridge",
            )
            db.session.add(c1)
            db.session.commit()

            c2 = CartridgeType(
                id=2,
                machine_type_id=1,
                name="i-STAT - EG7+ Test Cartridge",
            )
            db.session.add(c2)
            db.session.commit()

            c3 = CartridgeType(
                id=3,
                machine_type_id=1,
                name="i-STAT - EC8+ Test Cartridge",
            )
            db.session.add(c3)
            db.session.commit()

            c4 = CartridgeType(
                id=4,
                machine_type_id=1,
                name="i-STAT - CG8+ Test Cartridge",
            )
            db.session.add(c4)
            db.session.commit()

            c5 = CartridgeType(
                id=5,
                machine_type_id=1,
                name="i-STAT Chem 8+ Test Cartridge",
            )
            db.session.add(c5)
            db.session.commit()

            # Temporary for healthy range feature development



            # Link Measurement Types to Machines
            for i in range(1, 13):
                child = Analyte.query.get(i)
                c1.analytes.append(child)

            c2_analytes = {13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 29 }
            for i in c2_analytes:
                child = Analyte.query.get(i)
                c2.analytes.append(child)

            c3_analytes = { 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 26, 27, 29, 30 }
            for i in c3_analytes:
                child = Analyte.query.get(i)
                c3.analytes.append(child)

            c4_analytes = {13, 14, 15,16, 17, 18, 19, 20, 21, 22, 23, 29, 30}
            for i in c4_analytes:
                child = Analyte.query.get(i)
                c4.analytes.append(child)

            c5_analytes = {13, 14, 15, 16, 17, 20, 24, 26, 27, 28, 30 }
            for i in c5_analytes:
                child = Analyte.query.get(i)
                c5.analytes.append(child)

            db.session.commit()
            print("Migrating existing data...")

        except Exception as e:
            traceback.print_exc()
            print("Error: Drop all tables and start again.")

