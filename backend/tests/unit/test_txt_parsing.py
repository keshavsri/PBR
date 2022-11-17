# test_txt_parsing.py
# Tests text file parsing

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


def test_parse_file(client):
    try:
        path = "/api/sample/parse"
        files =  open(str(os.path.abspath(os.path.join(os.path.dirname(__file__)))) + '/mock_data/vetstat-machine-data/vetstat1.txt','rb')
        print(os.getcwd(), flush=True)
        response = client.post(
            path,
            content_type='multipart/form-data',
            data={
            'file': files
            }
        )
        assert response.status_code == 400
        responseJson = json.loads(response.get_data(as_text=True))
        print(responseJson, flush=True)

    except requests.exceptions.RequestException:
        print('HTTP Request failed')
    
# def test_parse_file2(app):
#     try:
#         path = "/api/sample/parse"
#         files={'upload_file': open(str(os.path.abspath(os.path.join(os.path.dirname(__file__)))) + '/test_data/vetstat-machine-data/vetstat2.txt','rb')}
#         response = requests.post(url=baseUrl+path, files=files)
#         responseJson = json.loads(response.text)
#         assert response.status_code == 200
#     except requests.exceptions.RequestException:
#         print('HTTP Request failed')
