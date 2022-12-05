# test_txt_parsing.py
# Tests text file parsing

import pytest
from unittest import mock
import requests
import os
import sys
from flask import Flask
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
print(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))


@pytest.fixture(scope="session")
def app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "42"
    return app

baseUrl = "https:/"
def test_parse_file(app):
    try:
        path = "/api/sample/parse"
        files={'upload_file': open(str(os.path.abspath(os.path.join(os.path.dirname(__file__)))) + '/mock_data/vetstat-machine-data/vetstat1.txt','rb')}
        print(os.getcwd(), flush=True)
        response = requests.post(url=baseUrl+path, files=files)
        responseJson = json.loads(response.text)
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
    
def test_parse_file2(app):
    try:
        path = "/api/sample/parse"
        files={'upload_file': open(str(os.path.abspath(os.path.join(os.path.dirname(__file__)))) + '/mock_data/vetstat-machine-data/vetstat2.txt','rb')}
        response = requests.post(url=baseUrl+path, files=files)
        responseJson = json.loads(response.text)
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
