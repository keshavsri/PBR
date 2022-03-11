
from api.APIUserController import token_required
from flask import Blueprint, jsonify, request

# Flask blueprint for the organization routes, this is the blueprint that is registered in the app.py file with a prefix of /organization
organizationBlueprint = Blueprint('organization', __name__)

# This is hitting the root of the organization route, it will return a list of all the organizations in the database,or create a new organization if the request is a POST
@organizationBlueprint.route('/', methods=['GET', 'POST'])
# This is hitting an id of an organization, it will return the organization with the id, or update the organization with the id if the request is a PUT or DELETE
@organizationBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handleOrganization(current_user, item_id=None):
    # Importing the model
    from models.organization import Organization
    from models.log import createLog
    from models.enums import LogActions
    from models.enums import Roles
    current_Organization = current_user.organization_id

    if current_Organization is item_id or current_user.role is Roles.Super_Admin:
        # Handling the GET requests
        if request.method == 'GET':
            # response json is created here and gets returned at the end of the block for GET requests.
            responseJSON = None
            # if item id exists then it will return the organization with the id
            if item_id:
                responseJSON = jsonify(Organization.query.get(item_id))
            # otherwise it will return all the organizations in the database
            else:
                responseJSON = jsonify(Organization.query.all())
            # if the response json is empty then return a 404 not found
            if responseJSON.json is None:
                responseJSON = jsonify({'message': 'No records found'})
                return responseJSON, 404
            else:
                return responseJSON, 200
        # Handling the POST requests
        elif request.method == 'POST':
            # checks if the organization already exists in the database
            if Organization.query.filter_by(name=request.json.get('name')).first() is None:
                # builds the organization from the request json
                newOrganization = Organization(request.json)
                from server import db
                # stages and then commits the new organization to the database
                db.session.add(newOrganization)
                db.session.commit()
                createLog(current_user, LogActions.ADD_ORGANIZATION, 'Created new organization: ' + newOrganization.name)
                return jsonify(Organization.query.get(request.json.get('id'))), 201
            # if the organization already exists then return a 409 conflict
            else:
                return jsonify({'message': 'Organization already exists', "existing organization": jsonify(Organization.query.filter_by(name=request.json.get('name')).first()).json}), 409

        # Handling the PUT requests
        elif request.method == 'PUT':
            #check if the organization exists in the database if it does then update the organization
            if Organization.query.get(item_id) is None:
                return jsonify({'message': 'Organization does not exist'}), 404
            else:
                from server import db
                Organization.query.filter_by(id=item_id).update(request.json)
                db.session.commit()
                editedOrganization = Organization.query.get(item_id)
                createLog(current_user, LogActions.EDIT_ORGANIZATION, 'Edited Organization: ' + editedOrganization.name)
                return jsonify(editedOrganization), 200

        # Handling the DELETE requests
        elif request.method == 'DELETE':
            # check if the organization exists in the database if it does then delete the organization
            if Organization.query.get(item_id) is None:
                return jsonify({'message': 'Organization does not exist'}), 404
            else:
                from server import db
                deletedOrganization = Organization.query.get(item_id)
                db.session.delete(Organization.query.get(item_id))
                db.session.commit()
                createLog(current_user, LogActions.DELETE_ORGANIZATION, 'Deleted Organization: ' + deletedOrganization.name)
                return jsonify({'message': 'Organization deleted'}), 200
        else:
            return {'message': 'Bad Request Method Not Allowed'}, 405
    else:
        return jsonify({'message': 'Forbidden'}), 403

# This is hitting the root of the source route, it will return a list of all the sources in the database,or create a new source if the request is a POST
@organizationBlueprint.route('/<int:item_id>/sources', methods=['GET', 'POST'])
# This is hitting an id of a source, it will return the source with the id, or update the source with the id if the request is a PUT or DELETE
@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['GET', 'PUT', 'DELETE'])
@token_required
def handleSources(current_user, item_id = None, source_id = None):
    # Importing the models
    from models.organization import Organization
    from models.source import Source
    
    # if the organization does not exist then return a 404 not found
    if item_id is None or Organization.query.get(item_id) is None:
        return jsonify({'message': 'Organization does not exist'}), 404
    
    from models.enums import Roles
    current_Organization = current_user.organization_id
    
    if current_Organization is item_id or current_user.role is Roles.Super_Admin:
        # handling the GET requests
        if request.method == 'GET':
            responseJSON = None
            # if source id is none return all the sources for the organization
            if source_id is None:
                responseJSON =  jsonify(Organization.query.get(item_id).sources)
            # if source id is not none then return the source with the id
            else:
                responseJSON = jsonify(Source.query.get(source_id))
            # if the response json is empty then return a 404 not found
            if responseJSON.json is None:
                responseJSON = jsonify({'message': 'No records found'})
                return responseJSON, 404
            else:
                return responseJSON, 200

        # handling the POST requests
        elif request.method == 'POST':
            from server import db
            # get the organization to append the source to
            organization = Organization.query.get(item_id)
            for sourceJSON in request.json:
                if Source.query.filter_by(name=sourceJSON.get('name')).first() is None:
                    source = Source(sourceJSON)
                    organization.sources.append(source)
                # if one of the sources already exists then return a 409 conflict anf rollback the database
                else:
                    db.session.rollback()
                    return jsonify({'message': 'Source already exists'}), 409
            db.session.commit()
            return jsonify(Organization.query.get(item_id).sources), 201

        # handling the PUT requests
        elif request.method == 'PUT':
            # check if the source exists in the database if it does then update the source
            from server import db
            source = Source.query.get(source_id)
            if source is None:
                return jsonify({'message': 'Source does not exist'}), 404
            else:
                Source.query.filter_by(id=source_id).update(request.json)
                db.session.commit()
                return jsonify(Source.query.get(source_id)), 200

        # handling the DELETE requests
        elif request.method == 'DELETE':
            # check if the source exists in the database if it does then delete the source
            from server import db
            source = Source.query.get(source_id)
            if Source.query.get(source_id) is None:
                return jsonify({'message': 'Source does not exist'}), 404
            else:
                db.session.delete(Source.query.get(source_id))
                db.session.commit()
                return jsonify({'message': 'Source deleted'}), 200
        # If the request is not a GET, POST, PUT, or DELETE then return a 405 Method Not Allowed
        return {'message': 'Bad Request Method Not Allowed'}, 405
    else:
        return jsonify({'message': 'Forbidden'}), 403
