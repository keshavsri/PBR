from flask import Blueprint, jsonify, request


organizationBlueprint = Blueprint('organization', __name__)

@organizationBlueprint.route('/<int:item_id>', methods=['GET', 'PUT', 'DELETE'])
@organizationBlueprint.route('/', methods=['GET', 'POST'])
def route_setting_all(item_id=None):
    from models.organization import Organization
    responseJSON = None
    if request.method == 'GET':
        if item_id:
            responseJSON = jsonify(Organization.query.get(item_id))
        else:
            responseJSON = jsonify(Organization.query.all())
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    elif request.method == 'POST':
        if Organization.query.get(request.json.get('id')) is None:
            newOrganization = Organization(request.json)
            from server import db
            db.session.add(newOrganization)
            db.session.commit()
            return jsonify(Organization.query.get(request.json.get('id'))), 201
        else:
            return jsonify({'message': 'Organization already exists'}), 400
        
    elif request.method == 'PUT':
        if Organization.query.get(item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            from server import db
            Organization.query.filter_by(id=item_id).update(request.json)
            db.session.commit()
            return jsonify(Organization.query.get(item_id)), 200
    elif request.method == 'DELETE':
        if Organization.query.get(item_id) is None:
            return jsonify({'message': 'Organization does not exist'}), 404
        else:
            from server import db
            db.session.delete(Organization.query.get(item_id))
            db.session.commit()
            return jsonify({'message': 'Organization deleted'}), 200
    return responseJSON, 400

@organizationBlueprint.route('/<int:item_id>/sources', methods=['GET', 'POST'])
@organizationBlueprint.route('/<int:item_id>/sources/<int:source_id>', methods=['GET', 'PUT', 'DELETE'])
def handleSources(item_id = None, source_id = None):
    from models.organization import Organization
    responseJSON = None
    if item_id is None or Organization.query.get(item_id) is None:
        return jsonify({'message': 'Organization does not exist'}), 404
    if request.method == 'GET':
        if source_id is None:
            responseJSON =  jsonify(Organization.query.get(item_id).sources)
        else:
            from models.source import Source
            responseJSON = jsonify(Source.query.get(source_id))
        if responseJSON.json is None:
            responseJSON = jsonify({'message': 'No records found'})
            return responseJSON, 404
        else:
            return responseJSON, 200
    elif request.method == 'POST':
        from server import db
        organization = Organization.query.get(item_id)
        for sourceJSON in request.json:
            from models.source import Source
            if Source.query.get(sourceJSON.get('id')) is None:
                source = Source(sourceJSON)
                organization.sources.append(source)
            else:
                responseJSON = jsonify({'message': 'Source already exists'}), 400
        db.session.commit()
        return jsonify(Organization.query.get(item_id).sources), 201
    elif request.method == 'PUT':
        from server import db
        from models.source import Source
        source = Source.query.get(source_id)
        if source is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            Source.query.filter_by(id=source_id).update(request.json)
            db.session.commit()
            return jsonify(Source.query.get(source_id)), 200
    elif request.method == 'DELETE':
        from server import db
        from models.source import Source
        source = Source.query.get(source_id)
        if Source.query.get(source_id) is None:
            return jsonify({'message': 'Source does not exist'}), 404
        else:
            db.session.delete(Source.query.get(source_id))
            db.session.commit()
            return jsonify({'message': 'Source deleted'}), 200
