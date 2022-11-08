from src.models import User, Organization, Source, Flock, Sample, Measurement, Analyte, CartridgeType, db
from src.enums import AgeUnits, ValidationTypes, SampleTypes
from src import app
import pandas as pd
import math


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


def insert_records(df, abbrvs ,machine_type_id):
    for row in df.itertuples():
        user = User.query.get(1)
        organization = Organization.query.get(1)
        cartridge_type = CartridgeType.query.filter_by(machine_type_id=machine_type_id).first()

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

        print(row, flush=True)

        sample = Sample(
            comments = row.comments,
            flock_age = row.age,
            flock_age_unit = determine_flock_age_unit(row.age_unit),
            validation_status = ValidationTypes.Accepted,
            sample_type = row.sample_type,
            user_id = user.id,
            flock_id = flock.id,
            # cartridge_type_id = cartridge_type.id
        )
        db.session.add(sample)
        db.session.commit()
        db.session.refresh(sample)

        measurements = []
        analyte_abbrvs = abbrvs
        for abbrv in analyte_abbrvs:
            analyte = Analyte.query.filter_by(abbreviation=abbrv, machine_type_id=machine_type_id).first()
            #print(abbrv, flush=True)
            print(analyte.abbreviation, flush=True)
            if math.isnan(getattr(row, abbrv.replace("+",""))):
                continue
            measurement = Measurement(
                value = getattr(row, abbrv.replace("+","")),
                analyte_id = analyte.id,
                sample_id = sample.id
            )
            measurements.append(measurement)
        sample.measurements = measurements
        db.session.commit()


def load_samples():
    # Read
    bird_df = pd.read_csv("initdb_bird.csv", engine="python")
    istat_df = pd.read_csv("initdb_istat.csv", engine="python")
    vetscan_df = pd.read_csv("initdb_vetscan.csv", engine="python")
    

    # Wrangling I
    bird_df["gender"] = bird_df.gender.apply(capitalize)
    bird_df["species"] = bird_df.species.apply(capitalize)
    bird_df["age_unit"] = bird_df.age_unit.apply(capitalize)
    bird_df["production_type"] = bird_df.production_type.apply(capitalize)
    bird_df["sample_type"] = bird_df.healthy.apply(determine_sample_type)

    bird_df = bird_df.drop(columns=["strain"])
    bird_df = bird_df.drop(columns=["healthy"])
    bird_df = bird_df.drop(columns=["date_tested"])
    istat_df = istat_df.drop(columns=["ID"])
    vetscan_df = vetscan_df.drop(columns=["ID"])

    bird_df = bird_df.replace("Not reported", "Unknown")
    bird_df = bird_df.replace("Broiler breeder", "Broiler")
    bird_df = bird_df.replace("Byp, layer", "BYP")
    bird_df = bird_df.rename(columns={"bird_ID" : "flock_ID"})
    istat_df = istat_df.rename(columns={"bird_ID" : "flock_ID"})
    vetscan_df = vetscan_df.rename(columns={"bird_ID" : "flock_ID"})

    # Merging
    istat_df = istat_df.merge(bird_df, how="inner", on =["flock_ID"])
    vetscan_df = vetscan_df.merge(bird_df, how="inner", on =["flock_ID"])

    # Wrangling II
    istat_df = istat_df.where(pd.notnull(istat_df), None)
    vetscan_df = vetscan_df.where(pd.notnull(vetscan_df), None)

    # DB Session begins
    with app.app_context():
        # Inserting sources, flocks, and samples (vetscan)
        # TODO vetscan
        vetscan_analyte_abbrvs = ["AST","BA","CK","UA","GLU","CA","PHOS","TP","ALB","GLOB","K+","NA+"]
        insert_records(vetscan_df, vetscan_analyte_abbrvs, 2)

        # Inserting sources, flocks, and samples (istat)
        istat_analyte_abbrvs = ["pH", "PCO2", "PO2", "BE", "HCO3", "TCO2", "sO2", "Na", "K", "iCa", "Glu", "Hct", "Hgb"]
        # TODO get istat_analyte_abbrvs via ORM
        insert_records(istat_df, istat_analyte_abbrvs, 1)

        print("Initial sample, flock, and source data")


load_samples()

