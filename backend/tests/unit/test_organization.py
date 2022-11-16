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


@pytest.fixture(autouse=True)
def run_before_and_after_tests(client):
    """Fixture to execute asserts before and after a test is run"""
    response = client.post(
        "/api/user/login",
        json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
    assert response.status_code == 200
    yield # this is where the testing happens

    # Teardown : fill with any logic you want

def test_post_organization(client):
    # Post Organization
    # POST http://127.0.0.1:3005/api/organization/

    try:
        response = client.post(
            "/api/organization/",
            json={
                "city": "Raleigh",
                "notes": "test note",
                "street_address": "123 Main St",
                "zip": "27606",
                "name": "NCSU alt",
                "state": "North Carolina"
            }
        )
        assert response.status_code == 201
        cookie = next(
            (cookie for cookie in client.cookie_jar if cookie.name == "pbr_token"),
            None
        )
        assert cookie is not None


    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_put_organization(client):
    # Put Organization
    # PUT http://127.0.0.1:3005/api/organization/2

    try:
        response = client.put(
            "/api/organization/1",
            json={
                "city": "Raleigh",
                "notes": "Edited for testing",
                "street_address": "123456 Main St",
                "zip": "27606",
                "name": "NCSU  edited",
                "state": "NC"
            }
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_organizations(client):
    # Get Organizations
    # GET http://127.0.0.1:3005/api/organization/

    try:
        response = client.get(
            "/api/organization/"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_organization(client):
    # Get Organization
    # GET http://127.0.0.1:3005/api/organization/1

    try:
        response = client.get(
            "/api/organization/1"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')