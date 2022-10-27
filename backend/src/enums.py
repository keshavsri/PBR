from enum import Enum
from enum import IntEnum


class States (str, Enum):
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
    LA = "Louisiana"
    MA = "Massachusetts"
    MD = "Maryland"
    ME = "Maine"
    MI = "Michigan"
    MN = "Minnesota"
    MO = "Missouri"
    MS = "Mississippi"
    MT = "Montana"
    NC = "North Carolina"
    ND = "North Dakota"
    NE = "Nebraska"
    NH = "New Hampshire"
    NJ = "New Jersey"
    NM = "New Mexico"
    NV = "Nevada"
    NY = "New York"
    OH = "Ohio"
    OK = "Oklahoma"
    OR = "Oregon"
    PA = "Pennsylvania"
    RI = "Rhode Island"
    SC = "South Carolina"
    SD = "South Dakota"
    TN = "Tennessee"
    TX = "Texas"
    UT = "Utah"
    VA = "Virginia"
    VT = "Vermont"
    WA = "Washington"
    WI = "Wisconsin"
    WV = "West Virginia"
    WY = "Wyoming"


class Roles(IntEnum):
    Super_Admin = 0
    Admin = 1
    Supervisor = 2
    Data_Collector = 3
    Guest = 4


class BirdGenders(str, Enum):
    Female = "Female"
    Male = "Male"
    Mixed = "Mixed"
    Unknown = "Unknown"


class AgeUnits(str, Enum):
    Days = "Days"
    Weeks = "Weeks"
    Months = "Months"
    Years = "Years"

class AgeGroup(str, Enum):
    Brooder = "Brooder (1-5 days)"
    Growing = "Growing (1-12 weeks)"
    Prelay = "Pre-lay (12-20 weeks)"
    Lay = "Lay (20+ weeks)"

class ValidationTypes(str, Enum):
    Saved = "Saved"
    Pending = "Pending"
    Accepted = "Accepted"
    Rejected = "Rejected"


class SampleTypes(str, Enum):
    # Healthy
    Surveillance = "Surveillance"
    # Unhealthy
    Diagnostic = "Diagnostic"


class Species(str, Enum):
    Turkey = "Turkey"
    Chicken = "Chicken"

class ChickenStrain(str, Enum):
    Ross_308 = "Ross 308"
    Ross_708 = "Ross 708"
    Ross_308_AP = "Ross 308 AP"
    Ranger_Premium = "Ranger Premium"
    Ranger_Classic = "Ranger Classic"
    Ranger_Gold = "Ranger Gold"
    Cobb500 = "Cobb500"
    Cobb700 = "Cobb700"
    Arbor_Acres_Plus = "Arbor Acres Plus"
    Hubbard = "Hubbard"
    Brown = "Brown"
    LSL = "LSL"
    Sandy = "Sandy"
    Silver = "Silver"
    Tradition = "Tradition"
    White = "White"

class TurkeyStrain(str, Enum):
    Nicholas_Select = "Nicholas Select"
    BUT_6 = "BUT 6"
    Converter = "Converter"
    Grade_Maker = "Grade Maker"
    Optima = "Optima"
    ConverterNOVO = "ConverterNOVO"


class ProductionTypes(str, Enum):
    Meat = "Meat"
    Layer = "Layer"
    Breeder = "Breeder"
    Broiler_Breeder = "Broiler Breeder"
    BYP = "BYP"


class LogActions(IntEnum):
    # User
    ACCOUNT_CREATED = 101
    LOGIN = 102
    
    # Sample
    ADD_SAMPLE = 201
    ADD_BATCH = 211
    ADD_MACHINE = 221
    ADD_MACHINETYPE = 231
    ADD_MEASUREMENTTYPE = 241
    ADD_MEASUREMENT = 251
    EDIT_SAMPLE = 203
    EDIT_BATCH = 213
    EDIT_MACHINE = 223
    EDIT_MACHINETYPE = 233
    EDIT_MEASUREMENTTYPE = 243
    EDIT_MEASUREMENT = 253
    DELETE_SAMPLE = 204
    DELETE_MULTIPLE_SAMPLES = 214
    DELETE_MACHINE = 224
    DELETE_MACHINETYPE = 234
    DELETE_MEASUREMENTTYPE = 244
    DELETE_MEASUREMENT = 254
    
    VALIDATE_SAMPLE = 301
    VALIDATE_MUlTIPLE_SAMPLES = 311
    VALID_TO_REJECT = 313
    VALID_TO_PENDING = 323
    REJECT_TO_VALID = 333
    PENDING_TO_VALID = 343
    PENDING_TO_REJECT = 353
    
    # Report
    GENERATE_REPORT = 401
    GENERATE_HEALTHY_RANGES = 411
    REGENERATE_HEALTHY_RANGES = 412
    
    # Settings
    EDIT_ACCOUNT = 503
    
    # Organization
    ADD_ORGANIZATION = 601
    EDIT_ORGANIZATION = 603
    EDIT_ORGANIZATION_CONTACT = 613
    DELETE_ORGANIZATION = 604
    
    # Source
    ADD_SOURCE = 701
    EDIT_SOURCE = 703
    DELETE_SOURCE = 704
    
    # User
    ADD_USER_INVITE = 801
    ADD_USER_CODE = 811
    EDIT_USER = 803
    ASSIGN_ROLE = 813
    DELETE_USER = 804
    
    # Flock
    ADD_FLOCK = 901
    EDIT_FLOCK = 903
    DELETE_FLOCK = 904
