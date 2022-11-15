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