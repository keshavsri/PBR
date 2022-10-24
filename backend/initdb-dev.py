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

        print("Initializing database with data...")

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
                
                
            )
            db.session.add(mt1)

            mt2 = Analyte(
                id=2,
                abbreviation="BA",
                units="umol/L",
                
                
            )
            db.session.add(mt2)

            mt3 = Analyte(
                id=3,
                abbreviation="CK",
                units="U/L",
                
                
            )
            db.session.add(mt3)

            mt4 = Analyte(
                id=4,
                abbreviation="UA",
                units="mg/dL",
                
                
            )
            db.session.add(mt4)

            mt5 = Analyte(
                id=5,
                name="Glucose",
                abbreviation="GLU",
                units="mg/dL",
                
                
            )
            db.session.add(mt5)

            mt6 = Analyte(
                id=6,
                name="Total Calcium",
                abbreviation="CA",
                units="mg/dL",
                
                
            )
            db.session.add(mt6)

            mt7 = Analyte(
                id=7,
                name="Phosphorus",
                abbreviation="PHOS",
                units="mg/dL",
                
                
            )
            db.session.add(mt7)

            mt8 = Analyte(
                id=8,
                name="Total Protein",
                abbreviation="TP",
                units="g/dL",
                
                
            )
            db.session.add(mt8)
            
            mt9 = Analyte(
                id=9,
                name="Albumen",
                abbreviation="ALB",
                units="g/dL",
                
                
            )
            db.session.add(mt9)

            mt10 = Analyte(
                id=10,
                name="Globulin",
                abbreviation="GLOB",
                units="g/dL",
                
                
            )
            db.session.add(mt10)

            mt11 = Analyte(
                id=11,
                name="Potassium",
                abbreviation="K+",
                units="mmol/L",
                
                
            )
            db.session.add(mt11)

            mt12 = Analyte(
                id=12,
                name="Sodium",
                abbreviation="NA+",
                units="mmol/L",
                
                
            )
            db.session.add(mt12)

            mt13 = Analyte(
                id=13,
                abbreviation="RQC",
                
                
            )
            db.session.add(mt13)

            mt14 = Analyte(
                id=14,
                abbreviation="QC",
                
                
            )
            db.session.add(mt14)

            mt15 = Analyte(
                id=15,
                abbreviation="HEM",
                
                
            )
            db.session.add(mt15)

            mt16 = Analyte(
                id=16,
                abbreviation="LIP",
                
                
            )
            db.session.add(mt16)

            mt17 = Analyte(
                id=17,
                abbreviation="ICT",
                
                
            )
            db.session.add(mt17)


            mt20 = Analyte(
                id=20,
                abbreviation="pH",
                
                
            )
            db.session.add(mt20)

            mt21 = Analyte(
                id=21,
                abbreviation="pCO2",
                
                
            )
            db.session.add(mt21)

            mt22 = Analyte(
                id=22,
                abbreviation="pO2",
                
                
            )
            db.session.add(mt22)

            mt23 = Analyte(
                id=23,
                abbreviation="BE",
                
                
            )
            db.session.add(mt23)

            mt24 = Analyte(
                id=24,
                abbreviation="HCO3",
                
                
            )
            db.session.add(mt24)

            mt25 = Analyte(
                id=25,
                abbreviation="tCO2",
                
                
            )
            db.session.add(mt25)

            mt26 = Analyte(
                id=26,
                abbreviation="sO2",
                
                
            )
            db.session.add(mt26)

            mt27 = Analyte(
                id=27,
                abbreviation="Na",
                
                
            )
            db.session.add(mt27)

            mt28 = Analyte(
                id=28,
                abbreviation="K",
                
                
            )
            db.session.add(mt28)

            mt29 = Analyte(
                id=29,
                abbreviation="iCa",
                
                
            )
            db.session.add(mt29)

            mt30 = Analyte(
                id=30,
                abbreviation="Glu",
                
                
            )
            db.session.add(mt30)

            mt31 = Analyte(
                id=31,
                abbreviation="Hct",
                
                
            )
            db.session.add(mt31)

            mt32 = Analyte(
                id=32,
                abbreviation="Hb",
                
                
            )
            db.session.add(mt32)

            db.session.add(mt33)
            db.session.commit()
            
            # Link Measurement Types to Machines
            for i in range(1, 20):
                db.session.add(
                    Measurement(
                        machine_id=2,
                        Analyte_id=i
                    )
                )
            for i in range(20, 34):
                db.session.add(
                    Measurement(
                        machine_id=1,
                        Analyte_id=i
                    )
                )
            db.session.commit()
            print("Done!")
        except:
            print("Could not finish import. Drop all tables and start again.")

