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


sample_payload = {
    "comments": "Sample 1",
    "flock_id": 1,
    "cartridge_type_id": 2,
    "measurements": [
        {
            "value": "1",
            "analyte_id": 1
        },
        {
            "value": "1",
            "analyte_id": 2
        },
        {
            "value": "1",
            "analyte_id": 2
        },
        {
            "value": "1",
            "analyte_id": 3
        },
        {
            "value": "1",
            "analyte_id": 4
        },
        {
            "value": "1",
            "analyte_id": 5
        },
        {
            "value": "1",
            "analyte_id": 6
        },
        {
            "value": "1",
            "analyte_id": 7
        },
        {
            "value": "1",
            "analyte_id": 8
        },
        {
            "value": "1",
            "analyte_id": 9
        },
        {
            "value": "1",
            "analyte_id": 10
        },
        {
            "value": "1",
            "analyte_id": 11
        },
        {
            "value": "1",
            "analyte_id": 12
        }
    ]
}

def test_create_sample(client):
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:


        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/sample/",
            json=sample_payload
        )

        assert response.status_code == 201
        sample = json.loads(response.get_data(as_text=True))
        response = client.delete(
            f'/api/sample/{sample["id"]}'
        )
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_samples(client):
    # Get Machine
    # GET http://127.0.0.1:3005/api/machine/3

    try:
        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.get(
            "/api/sample/org_cartridge_type?organization_id=1&cartridge_type_id=1"
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_edit_sample(client):
    # Edit Machine
    # PUT http://127.0.0.1:3005/api/machine/1

    try:

        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/sample/",
            json=sample_payload
        )
        sample_payload["measurements"][0]["value"] = 2
        sample = json.loads(response.get_data(as_text=True))
        print(sample, flush=True)
        response = client.put(
            f'api/sample/{sample["id"]}',
            json=sample_payload
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_submit_sample(client):
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:


        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/sample/",
            json=sample_payload
        )

        assert response.status_code == 201
        sample = json.loads(response.get_data(as_text=True))
        response = client.put(
            f'/api/sample/submit/{sample["id"]}'
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_accept_sample(client):
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:


        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/sample/",
            json=sample_payload
        )

        assert response.status_code == 201
        sample = json.loads(response.get_data(as_text=True))
        response = client.put(
            f'/api/sample/submit/{sample["id"]}'
        )
        assert response.status_code == 200

        response = client.put(
            f'/api/sample/accept/{sample["id"]}'
        )
        assert response.status_code == 200

    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_reject_sample(client):
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:


        response = client.post(
            "/api/user/login",
            json={'email': 'pbrsuperadmin@ncsu.edu', 'password': 'C0ck@D00dleD00'}, follow_redirects=True)
        response = client.post(
            "/api/sample/",
            json=sample_payload
        )

        assert response.status_code == 201
        sample = json.loads(response.get_data(as_text=True))
        response = client.put(
            f'/api/sample/submit/{sample["id"]}'
        )
        assert response.status_code == 200

        response = client.put(
            f'/api/sample/reject/{sample["id"]}'
        )
        assert response.status_code == 200

    except requests.exceptions.RequestException:
        print('HTTP Request failed')