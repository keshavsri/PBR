from src.helpers.healthy_range import determine_age_group, get_min_max_from_age_group, reference_interval
from src.models import (
    HealthyRange as HealthyRangeORM,
    Organization as OrganizationORM,
    CartridgeType as CartridgeTypeORM,
    Analyte as AnalyteORM,
    Source as SourceORM,
    Sample as SampleORM,
    db, engine
)
from src.schemas import HealthyRange, Organization, Analyte, Source, Sample, Flock
from src.helpers import log
from src.api.user import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src.enums import Species, BirdGenders, AgeGroup, LogActions, HealthyRangeMethod


healthyRangeBlueprint = Blueprint('healthy-range', __name__)


@healthyRangeBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0])
def post_healthy_ranges(access_allowed, current_user):
    if access_allowed:
        HealthyRangeORM.query.filter_by(current=True).update({'current': False})
        analytes = AnalyteORM.query.all()
        for analyte in analytes:
            for species in Species:
                for method in HealthyRangeMethod:
                    for age_group in AgeGroup:
                        min_age, max_age = get_min_max_from_age_group(age_group)
                        for gender in BirdGenders:
                            if gender != BirdGenders.Male and gender != BirdGenders.Female:
                                continue
                            sql_text = db.text(
                                """
                                SELECT m.value
                                FROM measurement_table m,
                                    sample_table s,
                                    flock_table f
                                WHERE m.analyte_id = :analyte_id
                                    AND m.sample_id = s.id
                                    AND s.is_deleted = 0
                                    AND s.validation_status = "Accepted"
                                    AND s.sample_type = "Surveillance"
                                    AND s.flock_id = f.id
                                    AND f.species = :species
                                    AND f.gender = :gender
                                    AND CASE
                                        WHEN s.flock_age_unit = "Days"
                                            THEN s.flock_age BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Weeks"
                                            THEN s.flock_age * 7 BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Months"
                                            THEN s.flock_age * 30 BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Years"
                                            THEN s.flock_age * 365 BETWEEN :min_age AND :max_age
                                        END;
                                """
                            )

                            sql_args = {
                                'analyte_id' : analyte.id, 
                                'species' : species,
                                'gender' : gender,
                                'min_age' : min_age,
                                'max_age' : max_age
                            }

                            reponse = None
                            with engine.connect() as connection:
                                reponse = connection.execute(sql_text, sql_args).all()
                                if reponse is None or reponse == []:
                                    continue

                            measurements = []
                            for row in reponse:
                                measurements.append(row[0])
                            if len(measurements) < 2:
                                continue
                            
                            lower_bound, upper_bound = reference_interval(measurements, method)
                            healthy_range = HealthyRangeORM(
                                lower_bound=lower_bound,
                                upper_bound=upper_bound,
                                species=species,
                                gender=gender,
                                age_group=age_group,
                                analyte_id=analyte.id,
                                method=method
                            )

                            db.session.add(healthy_range)
                            db.session.commit()
                        
                            sql_text = db.text(
                                """
                                SELECT m.value
                                FROM measurement_table m,
                                    sample_table s,
                                    flock_table f
                                WHERE m.analyte_id = :analyte_id
                                    AND m.sample_id = s.id
                                    AND s.is_deleted = 0
                                    AND s.validation_status = "Accepted"
                                    AND s.sample_type = "Surveillance"
                                    AND s.flock_id = f.id
                                    AND f.species = :species
                                    AND CASE
                                        WHEN s.flock_age_unit = "Days"
                                            THEN s.flock_age BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Weeks"
                                            THEN s.flock_age * 7 BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Months"
                                            THEN s.flock_age * 30 BETWEEN :min_age AND :max_age
                                        WHEN s.flock_age_unit = "Years"
                                            THEN s.flock_age * 365 BETWEEN :min_age AND :max_age
                                        END;
                                """
                            )

                            sql_args = {
                                'analyte_id' : analyte.id, 
                                'species' : species,
                                'min_age' : min_age,
                                'max_age' : max_age
                            }

                            reponse = None
                            with engine.connect() as connection:
                                reponse = connection.execute(sql_text, sql_args).all()
                                if reponse is None or reponse == []:
                                    continue

                            measurements = []
                            for row in reponse:
                                measurements.append(row[0])
                            if len(measurements) < 2:
                                continue
                            
                            lower_bound, upper_bound = reference_interval(measurements, method)
                            healthy_range = HealthyRangeORM(
                                lower_bound=lower_bound,
                                upper_bound=upper_bound,
                                species=species,
                                gender=None,
                                age_group=age_group,
                                analyte_id=analyte.id,
                                method=method
                            )

                            db.session.add(healthy_range)
                            db.session.commit()

        log.create_log(current_user, LogActions.GENERATE_HEALTHY_RANGES, 'Generated healthy ranges:')
        return jsonify({'message': 'Generated new healthy ranges'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@healthyRangeBlueprint.route('', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_healthy_ranges(access_allowed, current_user):
    if access_allowed:
        filters = {
            'species' : request.args.get('species'),
            'gender' : request.args.get('gender'),
            'age_group' : request.args.get('age_group'),
            'cartridge_type_id' : request.args.get('cartridge_type_id'),
            'method' : request.args.get('method')
        }

        for attr, val in filters.values():
            if val is None:
                return jsonify({'message': f'Filter value for {attr} not provided'}), 400
        
        if filters['gender'] != 'All':
            sql_text = db.text(
                """
                SELECT hr.*
                FROM healthy_range_table hr,
                    cartridge_types_analytes_table cta
                WHERE hr.current = 1
                    AND hr.species = :species
                    AND hr.gender = :gender
                    AND hr.age_group = :age_group
                    AND hr.method = :method
                    AND hr.analyte_id = cta.analyte_id
                    AND cta.cartridge_type_id = :cartridge_type_id;
                """
            )

            sql_args = {
                'species' : filters['species'],
                'gender' : filters['gender'],
                'age_group' : filters['age_group'],
                'cartridge_type_id' : filters['cartridge_type_id'],
                'method' : filters['method']
            }
        else:
            sql_text = db.text(
                """
                SELECT hr.*
                FROM healthy_range_table hr,
                    cartridge_types_analytes_table cta
                WHERE hr.current = 1
                    AND hr.species = :species
                    AND hr.gender IS NULL
                    AND hr.age_group = :age_group
                    AND hr.method = :method
                    AND hr.analyte_id = cta.analyte_id
                    AND cta.cartridge_type_id = :cartridge_type_id;
                """
            )

            sql_args = {
                'species' : filters['species'],
                'age_group' : filters['age_group'],
                'cartridge_type_id' : filters['cartridge_type_id'],
                'method' : filters['method']
            }

        rows = []
        with engine.connect() as connection:
            rows = connection.execute(sql_text, sql_args).all()

        healthy_ranges = []
        for row in rows:
            healthy_ranges.append(
                HealthyRangeORM(
                    id=row[0],
                    lower_bound=row[1],
                    upper_bound=row[2],
                    species=row[3],
                    gender=row[4],
                    age_group=row[5],
                    method=row[6],
                    generated=row[7],
                    current=row[8],
                    analyte_id=row[9],
                    analyte=Analyte.from_orm(AnalyteORM.query.get(row[9]))
                )
            )

        response = [HealthyRange.from_orm(hr).dict() for hr in healthy_ranges]
        return jsonify(response), 200 

    else:
        return jsonify({'message': 'Role not allowed'}), 403



