from api.APIUserController import token_required
from flask import Blueprint, jsonify, request

flockBlueprint = Blueprint('flock', __name__)


@flockBlueprint.route('/', methods=['GET', 'POST'])
@flockBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handleFlock(current_user, item_id = None):
    from models.flock import Flock
    from models.enums import Roles
    from models.log import createLog
    from models.enums import LogActions
    if request.method == 'GET':
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        current_Organization = current_user.organization_id
        # if item id exists then it will return the Flock with the id
        if item_id:
            flock = Flock.query.get(item_id)
            if current_user.role == Roles.Super_Admin:
                responseJSON = jsonify(flock)
            elif flock.organization_id == current_Organization:
                responseJSON = jsonify(flock)
            else:
                return jsonify({'message': 'You cannot access this flock'}), 403
        
        elif current_user.role == Roles.Super_Admin:
            responseJSON = jsonify(Flock.query.all())
        else:
            responseJSON = jsonify(Flock.query.filter_by(organization_id=current_Organization).all())
        # if the response json is empty then return a 404 not found
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    elif request.method == 'POST':
        # checks if the Flock already exists in the database
        if Flock.query.filter_by(name=request.json.get('name')).first() is None:
            # builds the Flock from the request json
            newFlock = Flock(request.json)
            from server import db
            # stages and then commits the new Flock to the database
            db.session.add(newFlock)
            db.session.commit()
            createLog(current_user, LogActions.ADD_FLOCK, 'Created new Flock: ' + newFlock.name)
            return jsonify(Flock.query.get(request.json.get('id'))), 201
        # if the Flock already exists then return a 409 conflict
        else:
            return jsonify({'message': 'Flock already exists', "existing organization": jsonify(Flock.query.filter_by(name=request.json.get('name')).first()).json}), 409
        # Handling the PUT requests
    elif request.method == 'PUT':
        #check if the Flock exists in the database if it does then update the Flock
        if Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            from server import db
            if request.json.get('organization') is None and request.json.get('source') is None:
                Flock.query.filter_by(id=item_id).update(request.json)
                db.session.commit()
                editedFlock = Flock.query.get(item_id)
                createLog(current_user, LogActions.EDIT_FLOCK,
                'Edited Flock: ' + editedFlock.name)
                return jsonify(editedFlock), 200
            else:
                return jsonify({'message': 'Cannot Edit Organization or source'}), 400


    # Handling the DELETE requests
    elif request.method == 'DELETE':
        # check if the Flock exists in the database if it does then delete the Flock
        if Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first() is None:
            return jsonify({'message': 'Flock does not exist'}), 404
        else:
            from server import db
            deletedFlock = Flock.query.get(item_id)
            db.session.delete(Flock.query.filter_by(organization_id=current_user.organization_id, id=item_id).first())
            db.session.commit()
            createLog(current_user, LogActions.DELETE_FLOCK, 'Deleted Flock: ' + deletedFlock.name)
            return jsonify({'message': 'Flock deleted'}), 200

    # If the request is not a GET, POST, PUT, or DELETE then return a 405 Method Not Allowed
    return {'message': 'Bad Request Method Not Allowed'}, 405