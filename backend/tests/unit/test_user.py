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



def test_request_me(client):
    # Request
    # GET http://127.0.0.1:3005/api/user/me

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "/api/user/me",
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')

def test_get_users(client):
    # Request
    # GET http://127.0.0.1:3005/api/user/users/<int:org_id>

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "http://127.0.0.1:3005/api/user/organization/1"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')

# def test_delete_user(client):
#     # Request
#     # DELETE http://127.0.0.1:3005/api/user/<int:id>
#
#     try:
#         response = client.post(
#             "/api/user/login",
#             json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
#         response = requests.delete(
#             url="http://127.0.0.1:3005/api/user/2",
#             headers={
#                 "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
#             },
#         )
#         assert response.status_code == 404
#         print('Response HTTP Response Body: {content}'.format(
#             content=response.content))
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
#
#
def test_edit_user(client):
    # Request
    # PUT http://127.0.0.1:3005/api/user/<int:id>

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        assert response.status_code == 200
        response = client.put(
            "/api/user/1",
            json={
                "email": "pbrsuperadmin@ncsu.edu",
                "first_name": "Super Admin",
                "last_name": "PBR",
                "phone_number": "",
                "role": "Super_Admin",
                "notes": "",
                "organization_id": 1,
                "is_deleted": False
            }
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_signup_user(client):
    # Request
    # PUT http://127.0.0.1:3005/api/user/<int:id>

    try:
        data = {
            "email": "jjboike@ncsu.edu",
            "firstname": "Jack",
            "lastname": "Boike",
            "orgCode": "123456",
            "password": "password"
        }
        response = client.post(
            "/api/user/register",
            json=data
        )
        assert response.status_code == 200

        user_response = json.loads(response.get_data(as_text=True))
        print(user_response, flush=True)
        response = client.get(
            f'/api/user/{user_response["id"]}'
        )
        assert response.status_code == 200
        response = client.delete(
            f'/api/user/{user_response["id"]}'
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')