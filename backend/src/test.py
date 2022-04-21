from src.Models import *
from src import app



with app.app_context():
    # print(db.session.query(Organization.id, Sample.id)
    #     .join(OrganizationSource_Flock_Sample, Sample.organizationsource_flock_sample_id == OrganizationSource_Flock_Sample.c.id)
    #     .join(OrganizationSource, OrganizationSource_Flock_Sample.c.organizationsource_id == OrganizationSource.c.id)
    #     .join(Organization, OrganizationSource.c.organization_id == Organization.id)
    #     .all())
    # samples = db.session.query(Sample, OrganizationSource_Flock_Sample).join(OrganizationSource_Flock_Sample, Sample.organizationsource_flock_sample_id == OrganizationSource_Flock_Sample.id).filter(OrganizationSource_Flock_Sample.organization_id==1).all()
    samples = get_sample_joined(db.session)
    # q=db.session.query(Sample).all()
    print(samples)



