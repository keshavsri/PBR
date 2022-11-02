from src.models import User, Organization, Source, Flock, Sample, Measurement, Analyte, CartridgeType, db
from src.enums import AgeUnits, ValidationTypes, SampleTypes
from src import app
import pandas as pd


def determine_sample_type(val):
    return SampleTypes.Surveillance if val else SampleTypes.Diagnostic


def capitalize(val):
    return val.capitalize()


def determine_flock_age_unit(val):
    if val == "D":
        return AgeUnits.Days
    elif val == "W":
        return AgeUnits.Weeks
    elif val == "M":
        return AgeUnits.Months
    elif val == "Y":
        return AgeUnits.Years


def load_samples():
    # Read csv
    bird_csv = pd.read_csv("initdb_bird.csv", engine="python")
    istat_csv = pd.read_csv("initdb_istat.csv", engine="python")
    vetscan_csv = pd.read_csv("initdb_vetscan.csv", engine="python")


    # Wrangling
    bird_csv["gender"] = bird_csv.gender.apply(capitalize)
    bird_csv["species"] = bird_csv.species.apply(capitalize)
    bird_csv["age_unit"] = bird_csv.age_unit.apply(capitalize)
    bird_csv["production_type"] = bird_csv.production_type.apply(capitalize)
    bird_csv["sample_type"] = bird_csv.healthy.apply(determine_sample_type)

    bird_csv = bird_csv.drop(columns=["healthy"])
    bird_csv = bird_csv.drop(columns=["strain"])
    bird_csv = bird_csv.drop(columns=["date_tested"])
    istat_csv = istat_csv.drop(columns=["ID"])
    vetscan_csv = vetscan_csv.drop(columns=["ID"])

    bird_csv = bird_csv.rename(columns={"bird_ID" : "flock_ID"})
    istat_csv = istat_csv.rename(columns={"bird_ID" : "flock_ID"})
    vetscan_csv = vetscan_csv.rename(columns={"bird_ID" : "flock_ID"})


    # Merging
    istat_csv = istat_csv.merge(bird_csv, how="inner", on =["flock_ID"])
    vetscan_csv = vetscan_csv.merge(bird_csv, how="inner", on =["flock_ID"])


    with app.app_context():


        # Inserting sources, flocks, and samples (istat)
        for row in istat_csv.itertuples():
            user = User.query.get(1)
            organization = Organization.query.get(1)
            cartridge_type = CartridgeType.query.filter_by(machine_type_id=1).first()

            source = Source.query.filter_by(name=row.source).first()
            if source is None:
                source = Source(
                    name = row.source,
                    organization_id = organization.id
                )
            db.session.add(source)
            db.session.commit()
            db.session.refresh(source)

            flock = Flock(
                species = row.species,
                gender = row.gender,
                production_type = row.production_type,
                source_id = source.id
            )
            db.session.add(flock)
            db.session.commit()
            db.session.refresh(flock)

            sample = Sample(
                comments = row.comments,
                flock_age = row.age,
                flock_age_unit = determine_flock_age_unit(row.age_unit),
                validation_status = ValidationTypes.Accepted,
                sample_type = row.sample_type,
                user_id = user.id,
                flock_id = flock.id,
                cartridge_type_id = cartridge_type.id
            )
            db.session.add(sample)
            db.session.commit()
            db.session.refresh(sample)

            measurements = []
            analyte_abbrvs = ["pH", "POC2", "PO2", "BE", "HCO3", "TCO2", "sO", "Na", "K", "iCa", "Glu", "Hct", "Hgb"]
            for abbrv in analyte_abbrvs:
                analyte = Analyte.query.filter_by(abbreviation=abbrv).first()
                measurement = Measurement(
                    value = getattr(row, analyte),
                    analyte_id = analyte.id,
                    sample_id = sample.id
                )
                measurements.append(measurement)
            sample.measurements = measurements
            db.commit()

        print("Initial sample, flock, and source data")


load_samples()

