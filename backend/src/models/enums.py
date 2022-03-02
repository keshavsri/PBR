from enum import Enum


class States (Enum):
    AL = "Alabama"
    AK = "Alaska"
    AZ = "Arizona"
    AR = "Arkansas"
    CA = "California"
    CO = "Colorado"
    CT = "Connecticut"
    DE = "Delaware"
    DC = "District of Columbia"
    FL = "Florida"
    GA = "Georgia"
    HI = "Hawaii"
    ID = "Idaho"
    IL = "Illinois"
    IN = "Indiana"
    IA = "Iowa"
    KS = "Kansas"
    KY = "Kentucky"
    LA = 'Louisiana'
    MA = 'Massachusetts'
    MD = 'Maryland'
    ME = 'Maine'
    MI = 'Michigan'
    MN = 'Minnesota'
    MO = 'Missouri'
    MS = 'Mississippi'
    MT = 'Montana'
    NC = 'North Carolina'
    ND = 'North Dakota'
    NE = 'Nebraska'
    NH = 'New Hampshire'
    NJ = 'New Jersey'
    NM = 'New Mexico'
    NV = 'Nevada'
    NY = 'New York'
    OH = 'Ohio'
    OK = 'Oklahoma'
    OR = 'Oregon'
    PA = 'Pennsylvania'
    RI = 'Rhode Island'
    SC = 'South Carolina'
    SD = 'South Dakota'
    TN = 'Tennessee'
    TX = 'Texas'
    UT = 'Utah'
    VA = 'Virginia'
    VT = 'Vermont'
    WA = 'Washington'
    WI = 'Wisconsin'
    WV = 'West Virginia'
    WY = 'Wyoming'

class Roles(Enum):
    Super_Admin = 0
    Admin = 1
    Supervisor = 2
    Data_Collector = 3
    Guest = 4
    
class Bird_Genders(Enum):
    Female = 1
    Male = 2
    Not_Reported = 3

class Age_Units(Enum):
    Days = 0
    Weeks = 1
    Months = 2
    Years = 3

class Validation_Types(Enum):
    Pending = 0
    Accepted = 1
    Rejected = 2

class Sample_Types(Enum):
    # Healthy
    Surveillance = 0
    # Unhealthy
    Diagnostic = 1

class Species(Enum):
    Turkey = 0
    Chicken = 1
