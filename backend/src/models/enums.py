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
    
class BirdGenders(IntEnum):
    Female = 1
    Male = 2
    Mixed = 3
    Not_Reported = 4

class AgeUnits(IntEnum):
    Days = 0
    Weeks = 1
    Months = 2
    Years = 3

class ValidationTypes(IntEnum):
    Pending = 0
    Accepted = 1
    Rejected = 2

class SampleTypes(IntEnum):
    # Healthy
    Surveillance = 0
    # Unhealthy
    Diagnostic = 1

class Species(IntEnum):
    Turkey = 0
    Chicken = 1
    
class ProductionTypes(IntEnum):
    Meat = 0
    Broiler = 1
    Layer = 2
    Breeder = 3
    Broiler_Breeder = 4
class LogActions(IntEnum):
    # User
    ACCOUNT_CREATED = 101
    LOGIN = 102
    
    # Sample
    ADD_SAMPLE = 201
    ADD_BATCH = 211
    EDIT_SAMPLE = 203
    DELETE_SAMPLE = 204
    DELETE_MULTIPLE_SAMPLES = 214
    
    VALIDATE_SAMPLE = 301
    VALIDATE_MUlTIPLE_SAMPLES = 311
    VALID_TO_REJECT = 313
    VALID_TO_PENDING = 323
    REJECT_TO_VALID = 333
    PENDING_TO_VALID = 343
    PENDING_TO_REJECT = 353
    
    # Report
    GENERATE_REPORT = 401
    
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
