from dataclasses import dataclass
from glob import glob
from typing import List
from server import db
from models.enums import States
from datetime import datetime

from models.user import User
from models.flock import Flock
from models.source import Source
from models.organization import Organization
# Needs to be implemented
from models.machineType import MachineType
from models.enums import Age_Units
from models.enums import Validation_Types
from models.enums import Sample_Types
from models.enums import Bird_Genders
from models.enums import Species

@dataclass
class Sample(db.Model):
    id: int
    entered_by_user: User
    data_entry_timestamp: datetime.now().timestamp()
    flock: Flock
    flock_age: int
    flock_age_units_used: Age_Units
    species: Species
    source: Source
    organization: Organization
    validation_status: Validation_Types
    flock_gender: Bird_Genders
    sample_type: Sample_Types
    # need to figure this out
    strain: Strains
    # need to create MachineType
    machine_data: List[MachineType]
    comments: str

    ## VetScan VS2 ##
    date_of_VS2: datetime.date
    time_of_VS2: datetime.time

    ast: int
    ba: int
    ck: int
    ua: int
    glucose: int
    total_ca: int
    phos: int
    tp: int
    alb: int
    glob: int
    potassium: int
    sodium: int
    qc: int
    hem: int
    lip: int
    ict: int

    ## i-Stat Data ##
    date_of_iStat: datetime.date
    time_of_iStat: datetime.time

    ph: int
    pco2: int
    po2: int
    be: int
    hco3: int
    tco2: int
    so2: int
    na: int
    k: int
    ica: int
    glu: int
    hct: int
    hb: int
    istat_num: int

    def __init__ (self, requestJSON):
        self.flock = requestJSON.get('flock_ID')
        self.strain = requestJSON.get('strain')
        self.species = requestJSON.get('species')
        self.gender = requestJSON.get('gender')
        self.source = requestJSON.get('source')
        self.sample_type = requestJSON.get('sample_type')
        self.flock_age = requestJSON.get('age')
        self.flock_age_units_used = requestJSON.get('age_unit')