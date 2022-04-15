# test_auth_token.py
# Tests JWT Auth Token Creation/Parsing

import pytest
from unittest import mock
import requests
import os

from flask import Flask
import json
from backend.api.APIDataController import parse_file
@pytest.fixture(scope="session")
def app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "42"
    return app


baseUrl = "https://"
def test_parse_file():
    path = "/api/sample/parse"
    files={'upload_file': open('../test-data/vetstat-machine-data/vetstat1.txt','rb')}
    response = requests.post(url=baseUrl+path, files=files)
    responseJson = json.loads(response.text)
    console.log(responseJson)
