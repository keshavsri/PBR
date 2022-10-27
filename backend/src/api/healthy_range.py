from backend.src.helpers.healthy_range import reference_interval
from src.helpers.healthy_range import get_min_max_from_age_group
from src.models import HealthyRange as HealthyRangeORM, Analyte as AnalyteORM, db, engine
from src.schemas import HealthyRange
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify
from src.enums import Species, BirdGenders, AgeGroup, LogActions


healthyRangeBlueprint = Blueprint('healthy-range', __name__)

@healthyRangeBlueprint.route('/', methods=['POST'])
#@token_required
#@allowed_roles([0])
def post_healthy_ranges(access_allowed=True):
    if access_allowed:
        analytes = AnalyteORM.query.all()
        for analyte in analytes:
            for species in Species:
                for gender in BirdGenders:
                    for age_group in AgeGroup:
                        min_age, max_age = get_min_max_from_age_group(age_group)
                        sql_text = db.text(
                            """
                            SELECT m.value,
                              CASE
                                WHEN s.flock_age_units = "Days"
                                THEN s.flock_age
                                    WHEN s.flock_age_units = "Weeks"
                                    THEN s.flock_age * 7
                                WHEN s.flock_age_units = "Months"
                                    THEN s.flock_age * 30
                                WHEN s.flock_age_units = "Years"
                                    THEN s.flock_age * 365
                              END
                              AS age_in_days
                            FROM measurement_table m, sample_table s, flock_table f
                            WHERE m.sample_id = s.id 
                              AND s.is_deleted = 0
                              AND s.validation_status = "Accepted"
                              AND s.sample_type = "Surveillance"
                              AND m.analyte_id = :analyte_id 
                              AND s.flock_id = f.id 
                              AND f.species = :species 
                              AND f.gender = :gender 
                              AND age_in_days BETWEEN :min_age AND :max_age;
                            """
                        )
                        with engine.connect() as connection:
                            measurements = connection.execute(sql_text, {"analyte_id": analyte.id, "species": species, "gender": gender, "min_age": min_age, "max_age": max_age})
                        lower_bound, upper_bound = reference_interval(measurements)
                        healthy_range = HealthyRangeORM(lower_bound=lower_bound, upper_bound=upper_bound, species=species, gender=gender, age_group=age_group, analyte_id=analyte.id)
                        db.session.add(healthy_range)
                        db.session.commit()         
        return jsonify({'message': 'happy'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

