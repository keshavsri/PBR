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




def test_post_machine(client):
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/machine/",
            json={
                "machine_type_id": "1",
                "serial_number": "123457    ",
                "organization_id": "1"
            }
        )
        assert response.status_code == 201
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
#
#
#
def test_edit_machine(client):
    # Edit Machine
    # PUT http://127.0.0.1:3005/api/machine/1

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.put(
            "http://127.0.0.1:3005/api/machine/1",
            json={
                "machine_type_id": "1",
                "serial_number": "234567",
                "organization_id": "1"
            }
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
#
#
def test_get_machine(client):
    # Get Machine
    # GET http://127.0.0.1:3005/api/machine/3

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "/api/machine/1"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')