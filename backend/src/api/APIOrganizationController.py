
from api.APIUserController import token_required, allowed_roles
from flask import Blueprint, jsonify, request

# Flask blueprint for the organization routes, this is the blueprint that is registered in the app.py file with a prefix of /organization
organizationBlueprint = Blueprint('organization', __name__)

@organizationBlueprint.route('/', methods=['GET'])
@token_required
@allowed_roles([0])
def getOrganizations(access_allowed, current_user):
    if access_allowed:
        from models.organization import Organization
        responseJSON = jsonify(Organization.query.all())
        # if the response json is empty then return a 404 not found
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def getOrganization(access_allowed, current_user, item_id):
    if access_allowed:
        from models.organization import Organization
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the organization with the id
        if current_user.organization.id == item_id:
            responseJSON = jsonify(Organization.query.get(item_id))
        # otherwise it will return all the organizations in the database
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403
    

@organizationBlueprint.route('/', methods=['POST'])
@token_required
@allowed_roles([0])
def postOrganization(access_allowed, current_user):
    if access_allowed:
        from models.organization import Organization
        from models.log import createLog
        from models.enums import LogActions
        
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

    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@organizationBlueprint.route('/<int:item_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def putOrganization(access_allowed, current_user, item_id):
    if access_allowed:
        from models.organization import Organization
        from models.log import createLog
        from models.enums import LogActions
        #check if the organization exists in the database if it does then update the organization
        if Organization.query.get(item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            from server import db
            Organization.query.filter_by(id=item_id).update(request.json)
            db.session.commit()
            editedOrganization = Organization.query.get(item_id)
            createLog(current_user, LogActions.EDIT_ORGANIZATION, 'Edited Organization: ' + editedOrganization.name)
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@organizationBlueprint.route('/<int:item_id>/sources', methods=['GET'])
@token_required
@allowed_roles([0,1,2,3])
def getSources(access_allowed, current_user, item_id):
    if access_allowed:
        from models.organization import Organization
        from models.enums import Roles
        responseJSON = jsonify(Organization.query.get(item_id).sources)
        # if the response json is empty then return a 404 not found
        if responseJSON.json is None or (current_user.organization.id is not item_id and current_user.role.id is not Roles.Super_Admin):
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['GET'])
@token_required
@allowed_roles([0, 1, 2, 3])
def getSource(access_allowed, current_user, item_id, source_id):
    if access_allowed:
        from models.source import Source
        from models.enums import Roles
        # response json is created here and gets returned at the end of the block for GET requests.
        responseJSON = None
        # if item id exists then it will return the organization with the id
        if current_user.organization.id == item_id or current_user.role.id is Roles.Super_Admin:
            responseJSON = jsonify(Source.query.get(source_id))
        # otherwise it will return all the organizations in the database
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    else:
        return jsonify({'message': 'Role not allowed' + str(access_allowed)}), 403


@organizationBlueprint.route('/<int:item_id>/sources', methods=['POST'])
@token_required
@allowed_roles([0,1])
def postSource(access_allowed, current_user, item_id):
    if access_allowed:
        from models.organization import Organization
        from models.source import Source
        from models.log import createLog
        from models.enums import LogActions, Roles

        from server import db
        # get the organization to append the source to
        if item_id is not current_user.organization.id and current_user.role is not Roles.Super_Admin:
            return jsonify({'message': 'Cannot post to another organization'}), 403
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
        createLog(current_user, LogActions.ADD_SOURCE, 'Added source: ' + source.name + ' to organization: ' + organization.name)
        return jsonify(Organization.query.get(item_id).sources), 201

    else:
        return jsonify({'message': 'Role not allowed'}), 403


@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['PUT'])
@token_required
@allowed_roles([0, 1])
def putSource(access_allowed, current_user, item_id, source_id):
    if access_allowed:
        from models.source import Source
        from models.organization import Organization
        from models.log import createLog
        from models.enums import LogActions, Roles
        if item_id is not current_user.organization.id and current_user.role is not Roles.Super_Admin:
            return jsonify({'message': 'Cannot edit in another organization'}), 403
        # check if the source exists in the database if it does then update the source
        from server import db
        source = Source.query.get(source_id)
        if source is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            Source.query.filter_by(id=source_id).update(request.json)
            db.session.commit()
            createLog(current_user, LogActions.EDIT_SOURCE, 'Edited source: ' + source.name + ' in organization: ' + Organization.query.get(item_id).name)
            return jsonify(Source.query.get(source_id)), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403
    

@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['DELETE'])
@token_required
@allowed_roles([0,1])
def deleteSource(access_allowed, current_user, item_id, source_id):
    if access_allowed:
        from models.source import Source
        from models.organization import Organization
        from models.log import createLog
        from models.enums import LogActions, Roles
        if current_user.organization.id is not item_id and current_user.role is not Roles.Super_Admin:
            return jsonify({'message': 'Cannot delete in another organization'}), 403
        # check if the source exists in the database if it does then delete the source
        from server import db
        source = Source.query.get(source_id)
        if Source.query.get(source_id) is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            db.session.delete(Source.query.get(source_id))
            db.session.commit()
            createLog(current_user, LogActions.DELETE_SOURCE, 'Deleted source: ' + source.name + ' in organization: ' + Organization.query.get(item_id).name)
            return jsonify({'message': 'Source deleted'}), 200
    else:
        return jsonify({'message': 'Role not allowed'}), 403

@organizationBlueprint.route('/<int:item_id>')
@organizationBlueprint.route('/')
def invalid_method(item_id = None):
    return jsonify({'message': 'Invalid Method'}), 405

