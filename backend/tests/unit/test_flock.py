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



def test_post_flock(client):
    # Post Flock
    # POST http://127.0.0.1:3005/api/flock/

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "http://127.0.0.1:3005/api/flock/",
            json={
                "strain": "strain",
                "gender": "Unknown",
                "birthday": "2022-04-09 05:40:09",
                "species": "Chicken",
                "production_type": "Meat",
                "source_id": "1",
                "name": "Flock 2",
            }
        )
        assert response.status_code == 201
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_duplicate_flock(client):
    # Post Flock Duplicate
    # POST http://127.0.0.1:3005/api/flock/

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "http://127.0.0.1:3005/api/flock/",
            json={
                "strain": "strain",
                "source": "1",
                "gender": "Not_Reported",
                "source_id": "1",
                "species": "Chicken",
                "production_type": "Meat",
                "name": "Test Flock"
            }
        )
        assert response.status_code == 409
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_flock(client):
    # Get Flock
    # GET http://127.0.0.1:3005/api/flock/id/3

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "/api/flock/1"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')

def test_edit_flock(client):
    # Edit Flock
    # PUT http://127.0.0.1:3005/api/flock/2

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.put(
            "/api/flock/1",
            json={
                "gender": "Unknown",
                "species": "Chicken",
                "name": "Test Flock",
                "production_type": "Meat",
                "strain": "strain",
                "source_id": "1",
            }
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
