from src.models import *
from src import app
import sys
import bcrypt

if len(sys.argv) != 3:
    print("Invalid number of Arguments! Usage: initdb su_username su_password")
else:
    with app.app_context():
        """Initializes the database."""

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
                machinetype_id=1,
                organization_id=1
            )

            db.session.add(ncsu_istat)
            db.session.commit()

            ncsu_vetscan= Machine(
                id=2,
                serial_number=654321,
                machinetype_id=2,
                organization_id=1
            )

            db.session.add(ncsu_vetscan)
            db.session.commit()

            # Load in Measurement Types 
            mt1 = MeasurementType(
                id=1,
                abbreviation="AST",
                units="U/L",
                required=0,
                general=0
            )
            db.session.add(mt1)

            mt2 = MeasurementType(
                id=2,
                abbreviation="BA",
                units="umol/L",
                required=0,
                general=0
            )
            db.session.add(mt2)

            mt3 = MeasurementType(
                id=3,
                abbreviation="CK",
                units="U/L",
                required=0,
                general=0
            )
            db.session.add(mt3)

            mt4 = MeasurementType(
                id=4,
                abbreviation="UA",
                units="mg/dL",
                required=0,
                general=0
            )
            db.session.add(mt4)

            mt5 = MeasurementType(
                id=5,
                name="Glucose",
                abbreviation="GLU",
                units="mg/dL",
                required=0,
                general=0
            )
            db.session.add(mt5)

            mt6 = MeasurementType(
                id=6,
                name="Total Calcium",
                abbreviation="CA",
                units="mg/dL",
                required=0,
                general=0
            )
            db.session.add(mt6)

            mt7 = MeasurementType(
                id=7,
                name="Phosphorus",
                abbreviation="PHOS",
                units="mg/dL",
                required=0,
                general=0
            )
            db.session.add(mt7)

            mt8 = MeasurementType(
                id=8,
                name="Total Protein",
                abbreviation="TP",
                units="g/dL",
                required=0,
                general=0
            )
            db.session.add(mt8)
            
            mt9 = MeasurementType(
                id=9,
                name="Albumen",
                abbreviation="ALB",
                units="g/dL",
                required=0,
                general=0
            )
            db.session.add(mt9)

            mt10 = MeasurementType(
                id=10,
                name="Globulin",
                abbreviation="GLOB",
                units="g/dL",
                required=0,
                general=0
            )
            db.session.add(mt10)

            mt11 = MeasurementType(
                id=11,
                name="Potassium",
                abbreviation="K+",
                units="mmol/L",
                required=0,
                general=0
            )
            db.session.add(mt11)

            mt12 = MeasurementType(
                id=12,
                name="Sodium",
                abbreviation="NA+",
                units="mmol/L",
                required=0,
                general=0
            )
            db.session.add(mt12)

            mt13 = MeasurementType(
                id=13,
                abbreviation="RQC",
                required=0,
                general=0
            )
            db.session.add(mt13)

            mt14 = MeasurementType(
                id=14,
                abbreviation="QC",
                required=0,
                general=0
            )
            db.session.add(mt14)

            mt15 = MeasurementType(
                id=15,
                abbreviation="HEM",
                required=0,
                general=0
            )
            db.session.add(mt15)

            mt16 = MeasurementType(
                id=16,
                abbreviation="LIP",
                required=0,
                general=0
            )
            db.session.add(mt16)

            mt17 = MeasurementType(
                id=17,
                abbreviation="ICT",
                required=0,
                general=0
            )
            db.session.add(mt17)

            mt18 = MeasurementType(
                id=18,
                name="Rotor Lot Number",
                required=0,
                general=1
            )
            db.session.add(mt18)

            mt19 = MeasurementType(
                id=19,
                name="Patient ID",
                required=0,
                general=1
            )
            db.session.add(mt19)

            mt20 = MeasurementType(
                id=20,
                abbreviation="pH",
                required=0,
                general=0
            )
            db.session.add(mt20)

            mt21 = MeasurementType(
                id=21,
                abbreviation="pCO2",
                required=0,
                general=0
            )
            db.session.add(mt21)

            mt22 = MeasurementType(
                id=22,
                abbreviation="pO2",
                required=0,
                general=0
            )
            db.session.add(mt22)

            mt23 = MeasurementType(
                id=23,
                abbreviation="BE",
                required=0,
                general=0
            )
            db.session.add(mt23)

            mt24 = MeasurementType(
                id=24,
                abbreviation="HCO3",
                required=0,
                general=0
            )
            db.session.add(mt24)

            mt25 = MeasurementType(
                id=25,
                abbreviation="tCO2",
                required=0,
                general=0
            )
            db.session.add(mt25)

            mt26 = MeasurementType(
                id=26,
                abbreviation="sO2",
                required=0,
                general=0
            )
            db.session.add(mt26)

            mt27 = MeasurementType(
                id=27,
                abbreviation="Na",
                required=0,
                general=0
            )
            db.session.add(mt27)

            mt28 = MeasurementType(
                id=28,
                abbreviation="K",
                required=0,
                general=0
            )
            db.session.add(mt28)

            mt29 = MeasurementType(
                id=29,
                abbreviation="iCa",
                required=0,
                general=0
            )
            db.session.add(mt29)

            mt30 = MeasurementType(
                id=30,
                abbreviation="Glu",
                required=0,
                general=0
            )
            db.session.add(mt30)

            mt31 = MeasurementType(
                id=31,
                abbreviation="Hct",
                required=0,
                general=0
            )
            db.session.add(mt31)

            mt32 = MeasurementType(
                id=32,
                abbreviation="Hb",
                required=0,
                general=0
            )
            db.session.add(mt32)

            mt33 = MeasurementType(
                id=33,
                name="iStat Number",
                required=0,
                general=1
            )
            db.session.add(mt33)
            db.session.commit()
            
            # Link Measurement Types to Machines
            for i in range(1, 20):
                db.session.add(
                    Measurement(
                        machine_id=2,
                        measurementtype_id=i
                    )
                )
            for i in range(20, 34):
                db.session.add(
                    Measurement(
                        machine_id=1,
                        measurementtype_id=i
                    )
                )
            db.session.commit()
            print("Migrating existing data...")

        except Exception as e:
            traceback.print_exc()
            print("Error: Drop all tables and start again.")

