from flask import Blueprint

# Waiting for report model classes
batchReportBlueprint = Blueprint('batchReport', __name__)
sampleReportBlueprint = Blueprint('sampleReport', __name__)

@batchReportBlueprint.route('/<int:item_id>', methods=['GET'])
@batchReportBlueprint.route('/', methods=['GET'])
def route_setting_batchReport(item_id=None):
    # Waiting for report model classes

@sampleReportBlueprint.route('/<int:item_id>', methods=['GET'])
@sampleReportBlueprint.route('/', methods=['GET'])
def route_setting_sampleReport(item_id=None):
    # Waiting for report model classes
