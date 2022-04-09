import src.helpers
from src.api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request
from src import Models, Schemas
from src.enums import Roles, LogActions

flockBlueprint = Blueprint('flock', __name__)


@flockBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def getFlocks(access_allowed, current_user):
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        if current_user.role == Roles.Super_Admin:
            responseJSON = src.helpers.get_all_flocks()
        else:
            responseJSON = src.helpers.get_flock_by_org(current_Organization)
        # if the response json is empty then return a 404 not found
        if responseJSON is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@flockBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def getFlock(access_allowed, current_user, item_id):
    if access_allowed:
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        flock = Models.Flock.query.get(item_id)
        if flock is None:
            return jsonify({'message': 'No record found'}), 404
        if current_user.role == Roles.Super_Admin or flock.organization == current_Organization:
            responseJSON = src.helpers.get_flock_by_id(item_id)
        else:
            return jsonify({'message': 'You cannot access this flock'}), 403
        return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
    

@flockBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0, 1])
def postFlock(access_allowed, current_user):
    if access_allowed:
        # checks if the Flock already exists in the database
        if Models.Flock.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Flock from the request json
            newFlock = src.helpers.create_flock(request.json)
            # stages and then commits the new Flock to the database
            Models.db.session.add(newFlock)
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + newFlock.name)
            return jsonify(Models.Flock.query.get(request.json.get('id'))), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": Schemas.Flock.from_orm(Models.Flock.query.filter_by(name=request.json.get('name')).first()).dict()}), 409
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def putFlock(access_allowed, current_user, item_id):
    if access_allowed:
        #check if the Flock exists in the database if it does then update the Flock
        if Models.Flock.query.filter_by(organization=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            if request.json.get('organization') is None and request.json.get('source') is None:
                Models.Flock.query.filter_by(id=item_id).update(request.json)
                Models.db.session.commit()
                editedFlock = Models.Flock.query.get(item_id)
                Models.createLog(current_user, LogActions.EDIT_FLOCK,
                'Edited Flock: ' + editedFlock.name)
                return Schemas.Flock.from_orm(editedFlock).dict(), 200
            else:
                return jsonify({'message': 'Cannot Edit Organization or source'}), 400
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@flockBlueprint.route('/<int:item_id>', methods=['DELETE'])
@token_required
@allowed_roles([0, 1])
def deleteFlock(access_allowed, current_user, item_id):
    if access_allowed:
        # check if the Flock exists in the database if it does then delete the Flock
        if Models.Flock.query.filter_by(organization=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            deletedFlock = Models.Flock.query.get(item_id)
            Models.db.session.delete(Models.Flock.query.filter_by(organization=current_user.organization_id, id=item_id).first())
            Models.db.session.commit()
            Models.createLog(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + deletedFlock.name)
            return jsonify({'message': 'Flock deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@flockBlueprint.route('/<int:item_id>')
@flockBlueprint.route('/')
def invalid_method(item_id = None):
    return jsonify({'message': 'Invalid Method'}), 405
