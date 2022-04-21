import src.helpers
from http import HTTPStatus
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import Models, Schemas
from src.enums import Roles, LogActions

flockBlueprint = Blueprint('flock', __name__)


@flockBlueprint.route('/', methods=['GET'])
@flockBlueprint.route('/organization/<int:given_org_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_flocks(access_allowed, current_user, given_org_id=None):
    if access_allowed:

        current_organization = current_user.organization_id

        if given_org_id:
            if current_user.role == Roles.Super_Admin:
                response_json = src.helpers.get_flock_by_org(given_org_id)
            elif current_user.organization_id == given_org_id:
                response_json = src.helpers.get_flock_by_org(given_org_id)
            else:
                response_json = jsonify({'message': 'Insufficient Permissions'})
                return response_json, 401
        else:
            if current_user.role == Roles.Super_Admin:
                response_json = src.helpers.get_all_flocks()
            else:
                response_json = src.helpers.get_flock_by_org(current_organization)

        # if the response json is empty then return a 404 not found
        if response_json is None:
            response_json = jsonify({'message': 'No records found'})
            return response_json, 404
        else:
            return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@flockBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def get_flock(access_allowed, current_user, item_id):
    if access_allowed:

        current_organization = current_user.organization_id
        flock = src.helpers.get_flock_by_id(item_id)
        if flock is None:
            return jsonify({'message': 'No record found'}), 404
        if current_user.role == Roles.Super_Admin or flock.organization == current_organization:
            response_json = src.helpers.get_flock_by_id(item_id)
        else:
            return jsonify({'message': 'You cannot access this flock'}), 403
        return response_json, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
    

@flockBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def post_flock(access_allowed, current_user):
    if access_allowed:
        # checks if the Flock already exists in the database
        if Models.Flock.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Flock from the request json
            new_flock = src.helpers.create_flock(request.json)
            # stages and then commits the new Flock to the database
            Models.db.session.add(new_flock)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + new_flock.name)
            return Schemas.Flock.from_orm(new_flock).dict(), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": Schemas.Flock.from_orm(Models.Flock.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def put_flock(access_allowed, current_user, item_id):
    if access_allowed:
        # check if the Flock exists in the database if it does then update the Flock
        if Models.Flock.query.filter_by(organization=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            if request.json.get('organization') is None and request.json.get('source') is None:
                Models.Flock.query.filter_by(id=item_id).update(request.json)
                Models.db.session.commit()
                edited_flock = Models.Flock.query.get(item_id)
                Models.createLog(current_user, LogActions.EDIT_FLOCK, 'Edited Flock: ' + edited_flock.name)
                return Schemas.Flock.from_orm(edited_flock).dict(), 200
            else:
                return jsonify({'message': 'Cannot Edit Flock'}), 400
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def delete_flock(access_allowed, current_user, item_id):
    if access_allowed:
        # check if the Flock exists in the database if it does then delete the Flock
        if Models.Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            deleted_flock = Models.Flock.query.get(item_id)
            Models.db.session.delete(Models.Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first())
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + deleted_flock.name)
            return jsonify({'message': 'Flock deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@flockBlueprint.route('/<int:item_id>')
@flockBlueprint.route('/')
def invalid_method(item_id=None):
    return jsonify({'message': 'Invalid Method'}), 405


# Inspiration from https://roytuts.com/python-flask-rest-api-file-upload/
@flockBlueprint.route('/strains/<string:species>', methods=['GET'])
def get_strains(species=None):
    print(species.lower())
    # Move this to a database soon
    strains = {
        "chicken": [
            "Ross 308",
            "Ross 708",
            "Ross 308 AP",
            "Ranger Premium",
            "Ranger Classic",
            "Ranger Gold",
            "Cobb500",
            "Cobb700",
            "Arbor Acres Plus",
            "Hubbard",
            "Brown",
            "LSL",
            "Sandy",
            "Silver",
            "Tradition",
            "White",
        ],
        "turkey": [
            "Nicholas Select",
            "BUT 6",
            "Converter",
            "Grade Maker",
            "Optima",
            "ConverterNOVO",
        ],
    }

    if species and species.lower() in strains.keys():
        resp = jsonify(strains[species.lower()])
        resp.status_code = HTTPStatus.OK
        return resp
    elif species:
        resp = jsonify({
            'message': 'Unsupported Species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
    else:
        resp = jsonify({
            'message': 'Must include a species!'
        })
        resp.status_code = HTTPStatus.BAD_REQUEST
        return resp
