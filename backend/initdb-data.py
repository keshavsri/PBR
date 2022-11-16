from src.models import User, Organization, Source, Flock, Sample, Measurement, Analyte, CartridgeType, db
from src.enums import AgeUnits, ValidationTypes, SampleTypes
from src import app
from datetime import datetime, timedelta
import pandas as pd
import math


def determine_sample_type(val):
    return SampleTypes.Surveillance if val else SampleTypes.Diagnostic


def capitalize(val):
    return val.title()


def determine_flock_age_unit(age_unit):
    if age_unit == "D":
        return AgeUnits.Days
    elif age_unit == "W":
        return AgeUnits.Weeks
    elif age_unit == "M":
        return AgeUnits.Months
    elif age_unit == "Y":
        return AgeUnits.Years


def determine_age_in_days(age_val, age_unit):
    if age_unit == "D":
        return age_val
    elif age_unit == "W":
        return age_val * 7
    elif age_unit == "M":
        return age_val * 30
    elif age_unit == "Y":
        return age_val * 365


def insert_records(df, abbrvs, cartridge_type_id, machine_type_id):
    for row in df.itertuples():

        source = Source.query.filter_by(name=row.source).first()
        if source is None:
            source = Source(
                name = row.source,
                organization_id = 1
            )
        db.session.add(source)
        db.session.commit()
        db.session.refresh(source)

        flock = Flock(
            species = row.species,
            gender = row.gender,
            production_type = row.production_type,
            birthday = datetime.strptime(row.date_tested, "%d-%b-%y") - timedelta(days=determine_age_in_days(row.age, row.age_unit)),
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
            user_id = 1,
            flock_id = flock.id,
            cartridge_type_id = cartridge_type_id
        )
        db.session.add(sample)
        db.session.commit()
        db.session.refresh(sample)

        measurements = []
        analyte_abbrvs = abbrvs
        for abbrv in analyte_abbrvs:
            analyte = Analyte.query.filter_by(abbreviation=abbrv, machine_type_id=machine_type_id).first()
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


# Read
bird_df = pd.read_csv("initdb_bird.csv", engine="python")
istat_df = pd.read_csv("initdb_istat.csv", engine="python")
vetscan_df = pd.read_csv("initdb_vetscan.csv", engine="python")


# Wrangling I
bird_df["gender"] = bird_df.gender.apply(capitalize)
# bird_df["strain"] = bird_df.strain.apply(capitalize)
bird_df["species"] = bird_df.species.apply(capitalize)
bird_df["age_unit"] = bird_df.age_unit.apply(capitalize)
bird_df["production_type"] = bird_df.production_type.apply(capitalize)
bird_df["sample_type"] = bird_df.healthy.apply(determine_sample_type)

bird_df = bird_df.drop(columns=["healthy"])
istat_df = istat_df.drop(columns=["ID"])
vetscan_df = vetscan_df.drop(columns=["ID"])

bird_df = bird_df.replace("Not Reported", "Unknown")
bird_df = bird_df.replace("Broiler Breeder", "Broiler")
bird_df = bird_df.replace("Byp, Layer", "BYP")
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
    vetscan_analyte_abbrvs = ["AST","BA","CK","UA","GLU","CA","PHOS","TP","ALB","GLOB","K+","NA+"]
    insert_records(vetscan_df, vetscan_analyte_abbrvs, 1, 2)

    # Inserting sources, flocks, and samples (istat)
    istat_analyte_abbrvs = ["pH", "PCO2", "PO2", "BE", "HCO3", "TCO2", "sO2", "Na", "K", "iCa", "Glu", "Hct", "Hgb"]
    insert_records(istat_df, istat_analyte_abbrvs, 2, 1)
