#This file is intended to test the routing of various API endpoints
from lib2to3.pgen2 import token
import os
from sre_constants import ASSERT_NOT
import sys
import pytest
import requests
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.api import user
from src import app as _app

@pytest.fixture()
def app():
    app = _app
    app.config.update({
            "TESTING": True,
    })

    yield app

@pytest.fixture()
def client(app):
    with app.test_request_context():
        return app.test_client()





#
# def test_delete_source(client):
#     # Delete source
#     # DELETE http://127.0.0.1:3005/api/organization/1/sources/2
#
#     try:
#         response = client.post(
#             "/api/user/login",
#             json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/organization/1/sources/2",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')



#
#
def test_request_log(client):
    # Request
    # GET http://127.0.0.1:3005/api/log/

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "http://127.0.0.1:3005/api/log/user/1",
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
#
#


#
#
# def test_request_data(client):
#     # Request
#     # POST http://127.0.0.1:3005/api/data/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/data/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTc4MDA3LCJuYmYiOjE2NTAxNzgwMDcsImV4cCI6MTY1MDE4MTYwN30.7_035TwjtsjhoA4FaNmW8GdEMXBzv7_xlXUizVSlMig",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps([
#                 {
#                     "comments": "None",
#                     "id": 1,
#                     "flock_age": 1,
#                     "organization": None,
#                     "sample_type": "Diagnostic",
#                     "flock_age_unit": "Days",
#                     "flagged": False,
#                     "timestamp_added": "2022-04-09 04:05:47",
#                     "validation_status": "Pending",
#                     "entered_by_id": 1,
#                     "measurement_values": [
#                         {
#                             "sample_id": 1,
#                             "value": 1,
#                             "timestamp_added": "2022-04-09 04:05:47",
#                             "measurement_id": 1
#                         },
#                         {
#                             "sample_id": 1,
#                             "value": 2,
#                             "timestamp_added": "2022-04-09 04:05:47",
#                             "measurement_id": 2
#                         },
#                         {
#                             "sample_id": 1,
#                             "value": 5.247,
#                             "timestamp_added": "2022-04-09 04:05:47",
#                             "measurement_id": 3
#                         }
#                     ]
#                 }
#             ])
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
# def test_request_data2(client):
#     # Request (2)
#     # GET http://127.0.0.1:3005/api/data/
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/data/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#



#
#
#
# def test_delete_machine(client):
#     # Delete Machine
#     # DELETE http://127.0.0.1:3005/api/machine/3
#
#     try:
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/machine/3",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg5NjY2LCJuYmYiOjE2NTAxODk2NjYsImV4cCI6MTY1MDE5MzI2Nn0.9wq1wHVIcv5T40YxAxU8ExgDzL0vGEWF1YaLJ3cil5E",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_machine_type(client):
#     # Post Machine Type
#     # POST http://127.0.0.1:3005/api/machine/type/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/machine/type/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "name": "iStat 2"
#             })
#         )
#         assert response.status_code == 200
#
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_edit_machine_type(client):
#     # Edit Machine Type
#     # PUT http://127.0.0.1:3005/api/machine/type/2
#
#     try:
#         response = client.put(
#             url="http://127.0.0.1:3005/api/machine/type/2",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "name": "iStat 3"
#             })
#         )
#         assert response.status_code == 200
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_get_machine_type(client):
#     # Get Machine Type
#     # GET http://127.0.0.1:3005/api/machine/type/2
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/machine/type/2",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
#             },
#         )
#         assert response.status_code == 200
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_get_machine_types(client):
#     # Get Machine Types
#     # GET http://127.0.0.1:3005/api/machine/type/
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/machine/type/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_delete_machine_type(client):
#     # Delete Machine Type
#     # DELETE http://127.0.0.1:3005/api/machine/type/2
#
#     try:
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/machine/type/2",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_measurement(client):
#     # Post Measurement
#     # POST http://127.0.0.1:3005/api/measurement/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/measurement/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "machine_id": 1,
#                 "measurementtype_id": 1
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_measurement2(client):
#     # Post Measurement 2
#     # POST http://127.0.0.1:3005/api/measurement/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/measurement/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "machine_id": 1,
#                 "measurementtype_id": 2
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_measurement_3(client):
#     # Post Measurement 3
#     # POST http://127.0.0.1:3005/api/measurement/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/measurement/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "machine_id": 1,
#                 "measurementtype_id": 3
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_measurement4(client):
#     # Post Measurement 4
#     # POST http://127.0.0.1:3005/api/measurement/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/measurement/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "machine_id": 2,
#                 "measurementtype_id": 1
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
# def test_get_measurement(client):
#     # Get Measurement
#     # GET http://127.0.0.1:3005/api/measurement/1
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/measurement/1",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFhbmlzaGJoaXJ1ZEBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6MSwiaWF0IjoxNjQ5ODYzMjYwLCJuYmYiOjE2NDk4NjMyNjAsImV4cCI6MTY0OTg2Njg2MH0.0HZf04morJMsBE5Duh5i1L50Tdv7fcvU9C68Bo8720U",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_edit_measurement(client):
#     # Edit Measurement
#     # PUT http://127.0.0.1:3005/api/measurement/4
#
#     try:
#         response = client.put(
#             url="http://127.0.0.1:3005/api/measurement/4",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "machine_id": 2,
#                 "measurementtype_id": 2
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_get_measurements(client):
#     # Get Measurements
#     # GET http://127.0.0.1:3005/api/measurement/
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/measurement/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFhbmlzaGJoaXJ1ZEBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6MSwiaWF0IjoxNjQ5ODYzMjYwLCJuYmYiOjE2NDk4NjMyNjAsImV4cCI6MTY0OTg2Njg2MH0.0HZf04morJMsBE5Duh5i1L50Tdv7fcvU9C68Bo8720U",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_delete_measurement(client):
#     # Delete Measurement
#     # DELETE http://127.0.0.1:3005/api/measurement/1
#
#     try:
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/measurement/1",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_post_measurement_type(client):
#     # Post Measurement Type
#     # POST http://127.0.0.1:3005/api/measurement/type/
#
#     try:
#         response = client.post(
#             url="http://127.0.0.1:3005/api/measurement/type/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "abbreviation": "GLOB",
#                 "units": "g/dL",
#                 "name": "Globulin",
#                 "required": "True",
#                 "general": "True"
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_get_measurement_type(client):
#     # Get Measurement Type
#     # GET http://127.0.0.1:3005/api/measurement/type/1
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/measurement/type/1",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_edit_measurement_type(client):
#     # Edit Measurement Type
#     # PUT http://127.0.0.1:3005/api/measurement/type/1
#
#     try:
#         response = client.put(
#             url="http://127.0.0.1:3005/api/measurement/type/1",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#                 "Content-Type": "application/json; charset=utf-8",
#             },
#             data=json.dumps({
#                 "abbreviation": "GLOB E",
#                 "units": "g/dL",
#                 "name": "Globulin edit",
#                 "required": "True",
#                 "general": "False"
#             })
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_get_measurement_types(client):
#     # Get Measurement Types
#     # GET http://127.0.0.1:3005/api/measurement/type/
#
#     try:
#         response = client.get(
#             url="http://127.0.0.1:3005/api/measurement/type/",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
#
# def test_delete_measurement_type(client):
#     # Delete Measurement Type
#     # DELETE http://127.0.0.1:3005/api/measurement/type/1
#
#     try:
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/measurement/type/1",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
#             },
#         )
#         assert response.status_code == 200
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
        
def test_allowed_roles(client):
    roles = []
    roles.append(0)
    roles.append(1)
    roles.append(2)
    try:
       user.allowed_roles(roles) 
    except requests.exceptions.RequestException:
        print('failed')