# Example returning a source
def get_source(id: int) -> Source:
    # Get Source from Database
    s = SourceORM.query.filter_by(id=id).first()
    return Source(s)
    
def create_source(source: SourceCreate):
    # We use source.dict() to get a dictionary from the object and
    # then the ** passes the dict as keywords args which is what SQLAlchemy expects.

    source = SourceORM(**source.dict());

    # then save to database as normal
    db.session.add(source);

    # return created object
    db.session.commit();
    db.session.refresh(source);
    return source;


def json_to_source(json) -> SourceCreate:
    return SourceCreate(json)

# Example returning a user
def get_organization(id: int) -> Organization:
    # Get Organization from Database
    org = OrganizationORM.query.filter_by(id=id).first()
    return Organization(org)

def create_organization(organization: OrganizationCreate):
    # We use organization.dict() to get a dictionary from the object and
    # then the ** passes the dict as keywords args which is what SQLAlchemy expects.
    organization = OrganizationORM(**organization.dict())

    # then save to database as normal
    db.session.add(organization)

    # return created object
    db.session.commit()
    db.session.refresh(organization)
    return organization


def json_to_organization(json) -> OrganizationCreate:
    return OrganizationCreate(json)


def get_flock(id: int) -> Flock:
    flock = FlockORM.query.filter_by(id=id).first()
    return Flock(flock)

def create_flock(flock: FlockCreate):
    flock = FlockORM(**flock.dict())
    db.session.add(flock)
    db.session.commit()
    db.session.refresh(flock)
    return flock

def json_to_flock(json) -> FlockCreate:
    return Flock(json)
    