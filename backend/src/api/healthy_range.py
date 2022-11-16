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

                        query = """
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
                                    END
                        """

                        sql_args = {
                            'analyte_id' : analyte.id, 
                            'species' : species,
                            'min_age' : min_age,
                            'max_age' : max_age
                        }

                        sql_text = db.text(query + ";")

                        response = None
                        with engine.connect() as connection:
                            response = connection.execute(sql_text, sql_args).all()
                            if response is None or response == []:
                                continue

                        measurements = []
                        for row in response:
                            measurements.append(row[0])
                        if len(measurements) < 120:
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

                        for gender in BirdGenders:
                            if gender != BirdGenders.Male and gender != BirdGenders.Female:
                                continue

                            sql_text = db.text(query + "AND f.gender = :gender;")
                            sql_args.update({'gender' : gender})

                            response = None
                            with engine.connect() as connection:
                                response = connection.execute(sql_text, sql_args).all()
                                if response is None or response == []:
                                    continue

                            measurements = []
                            for row in response:
                                measurements.append(row[0])
                            if len(measurements) < 120:
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

        for attr, val in filters.items():
            if val is None:
                return jsonify({'message': f'Filter value for {attr} not provided'}), 400

        query = """
            SELECT hr.*
            FROM healthy_range_table hr,
                 cartridge_types_analytes_table cta
            WHERE hr.current = 1
                AND hr.species = :species
                AND hr.age_group = :age_group
                AND hr.method = :method
                AND hr.analyte_id = cta.analyte_id
                AND cta.cartridge_type_id = :cartridge_type_id
        """

        sql_args = {
            'species' : filters['species'],
            'age_group' : filters['age_group'],
            'cartridge_type_id' : filters['cartridge_type_id'],
            'method' : filters['method']
        }

        if filters['gender'] != 'All':
            query += "AND hr.gender = :gender;"
            sql_text = db.text(query)
            sql_args.update({'gender' : filters['gender']})
        else:
            query += "AND hr.gender IS NULL;"
            sql_text = db.text(query)

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


@healthyRangeBlueprint.route('/report', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3, 4])
def get_healthy_ranges_for_sample(access_allowed, current_user):
    if True:
        if request.args.get('sample_id') is None:
            return jsonify({'message': 'Sample must be specified'}), 400

        sample = SampleORM.query.filter_by(id=request.args.get('sample_id'), is_deleted=0).first()
        if sample is None:
            return jsonify({'message': 'Sample not found'}), 404

        if sample.flock is None:
            return jsonify({'message': 'Flock corresponding with sample not found'}), 404

        if sample.flock_age is None or sample.flock_age_unit is None:
            return jsonify({'message': 'Cannot generate report for sample without flock age and age units'}), 403

        filters = {
            'species' : sample.flock.species,
            'gender' : sample.flock.gender,
            'age_group' : determine_age_group(sample.flock_age, sample.flock_age_unit),
            'cartridge_type_id' : sample.cartridge_type_id,
            'method' : request.args.get('method')
        }

        for attr, val in filters.items():
            if val is None:
                return jsonify({'message': f'Filter value for {attr} not provided'}), 400

        query = """
            SELECT hr.*
            FROM healthy_range_table hr,
                 cartridge_types_analytes_table cta
            WHERE hr.current = 1
                AND hr.species = :species
                AND hr.age_group = :age_group
                AND hr.method = :method
                AND hr.analyte_id = cta.analyte_id
                AND cta.cartridge_type_id = :cartridge_type_id
        """

        sql_args = {
            'species' : filters['species'],
            'age_group' : filters['age_group'],
            'cartridge_type_id' : filters['cartridge_type_id'],
            'method' : filters['method']
        }

        if filters['gender'] == BirdGenders.Female or filters['gender'] == BirdGenders.Male:
            query += "AND hr.gender = :gender;"
            sql_text = db.text(query)
            sql_args.update({'gender' : filters['gender']})
        else:
            query += "AND hr.gender IS NULL;"
            sql_text = db.text(query)

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

        response_data = []
        for hr in healthy_ranges:
            response_data.append(
                {
                    'analyte_name' : hr.analyte.name,
                    'analyte_abbreviation' : hr.analyte.abbreviation,
                    'measurement_value' : MeasurementORM.query.filter_by(
                        sample_id = sample.id,
                        analyte_id = hr.analyte.id
                    ).first().value,
                    'lower_bound' : hr.lower_bound,
                    'upper_bound' : hr.upper_bound
                }
            )

        response_source = Source.from_orm(
            SourceORM.query.filter_by(
                id=sample.flock.source_id,
                is_deleted=0
            ).first()
        ).dict()

        response_organization = Organization.from_orm(
            OrganizationORM.query.filter_by(
                id=response_source.get('organization_id'),
                is_deleted=0
            ).first()
        ).dict()

        response_source.update({'organization' : response_organization})
        response_source.pop('organization_id')

        response_flock = Flock.from_orm(sample.flock).dict()
        response_flock.update({'source' : response_source})
        response_flock.pop('source_id')

        response_sample = Sample.from_orm(sample).dict()
        response_sample.update({'flock' : response_flock})
        response_sample.pop('measurements')

        response = {
            'sample' : response_sample,
            'data' : response_data,
            'filters' : filters
        }
        return jsonify(response), 200 

    else:
        return jsonify({'message': 'Role not allowed'}), 403

