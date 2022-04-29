#This file is intended to test the routing of various API endpoints
from lib2to3.pgen2 import token
import os
from sre_constants import ASSERT_NOT
import sys
import pytest
import requests
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.api import APIUserController


def test_send_request1():
    # API
    # GET http://127.0.0.1:3005/api/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/",
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_post_organization():
    # Post Organization
    # POST http://127.0.0.1:3005/api/organization/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/organization/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "organization_code": "541189",
                "city": "Raleigh",
                "mainContact": "1",
                "notes": "test note",
                "street_address": "123 Main St",
                "zip": "27606",
                "name": "NCSU alt",
                "state": "North Carolina"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_put_organization():
    # Put Organization
    # PUT http://127.0.0.1:3005/api/organization/2

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/organization/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "city": "Raleigh",
                "notes": "Edited for testing",
                "street_address": "123 Main St",
                "sources": [
                    {
                        "id": "2",
                        "street_address": "123 Main St",
                        "state": "North Carolina",
                        "name": "cvm alternative edit",
                        "city": "Raleigh",
                        "zip": "27606"
                    }
                ],
                "zip": "27606",
                "name": "NCSU alt edited",
                "state": "NC"
            })
        )
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_organizations():
    # Get Organizations
    # GET http://127.0.0.1:3005/api/organization/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/organization/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
            },
        )
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_organization():
    # Get Organization
    # GET http://127.0.0.1:3005/api/organization/1

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/organization/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
            },
        )
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_delete_source():
    # Delete source
    # DELETE http://127.0.0.1:3005/api/organization/1/sources/2

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/organization/1/sources/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_request_me():
    # Request
    # GET http://127.0.0.1:3005/api/user/me

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/user/me",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTgyMjk2LCJuYmYiOjE2NTAxODIyOTYsImV4cCI6MTY1MDE4NTg5Nn0.bqJ8igRVPDZNeQVZE7JDnsDk6e6rScIDrhqRc8V_1iM",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_request_log():
    # Request
    # GET http://127.0.0.1:3005/api/log/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/log/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_post_flock():
    # Post Flock
    # POST http://127.0.0.1:3005/api/flock/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "strain": "strain",
                "source": "1",
                "gender": "Unknown",
                "organization": "1",
                "birthday": "2022-04-09 05:40:09",
                "species": "Chicken",
                "production_type": "Meat",
                "source_id": "1",
                "name": "Flock 1",
                "organization_id": "1"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_duplicate_flock():
    # Post Flock Duplicate
    # POST http://127.0.0.1:3005/api/flock/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NDc5MzkzLCJuYmYiOjE2NDk0NzkzOTMsImV4cCI6MTY0OTQ4Mjk5M30.p1J34Lh6OKIZNf6WJRbDkrB4EskncXAE6SMigEhj9ZE",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "strain": "strain",
                "source": "1",
                "gender": "Not_Reported",
                "organization": "1",
                "species": "Chicken",
                "production_type": "Meat",
                "name": "Flock 2"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_flock():
    # Get Flock
    # GET http://127.0.0.1:3005/api/flock/id/3

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/flock/id/3",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_duplicate_flock():
    # Get Flock Duplicate
    # GET http://127.0.0.1:3005/api/flock/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NDc5MzkzLCJuYmYiOjE2NDk0NzkzOTMsImV4cCI6MTY0OTQ4Mjk5M30.p1J34Lh6OKIZNf6WJRbDkrB4EskncXAE6SMigEhj9ZE",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_edit_flock():
    # Edit Flock
    # PUT http://127.0.0.1:3005/api/flock/2

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/flock/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NDc5MzkzLCJuYmYiOjE2NDk0NzkzOTMsImV4cCI6MTY0OTQ4Mjk5M30.p1J34Lh6OKIZNf6WJRbDkrB4EskncXAE6SMigEhj9ZE",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "gender": "Not_Reported",
                "species": "Chicken",
                "name": "Flock 2 edited",
                "production_type": "Meat",
                "strain": "strain"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_flock():
    # Get Flock
    # GET http://127.0.0.1:3005/api/flock/id/2

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/flock/id/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_delete_flock():
    # Delete Flock
    # DELETE http://127.0.0.1:3005/api/flock/2

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/flock/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NTU2MTg2LCJuYmYiOjE2NDk1NTYxODYsImV4cCI6MTY0OTU1OTc4Nn0.jrjsa9fPirdArrXXltATv5tU4NXLNjH_qrQF2gtgZ_4",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_flock_duplicate2():
    # Get Flock Duplicate (2)
    # GET http://127.0.0.1:3005/api/flock/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_flock():
    # Post Flock
    # POST http://127.0.0.1:3005/api/flock/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NTU2MTg2LCJuYmYiOjE2NDk1NTYxODYsImV4cCI6MTY0OTU1OTc4Nn0.jrjsa9fPirdArrXXltATv5tU4NXLNjH_qrQF2gtgZ_4",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "strain": "strain",
                "gender": "3",
                "species": "1",
                "production_type": "1",
                "source_id": "1",
                "name": "Flock 2",
                "organization_id": "1"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_flock_duplicate3():
    # Get Flock Duplicate (3)
    # GET http://127.0.0.1:3005/api/flock/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/flock/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NDc5MzkzLCJuYmYiOjE2NDk0NzkzOTMsImV4cCI6MTY0OTQ4Mjk5M30.p1J34Lh6OKIZNf6WJRbDkrB4EskncXAE6SMigEhj9ZE",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_request_data():
    # Request
    # POST http://127.0.0.1:3005/api/data/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/data/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTc4MDA3LCJuYmYiOjE2NTAxNzgwMDcsImV4cCI6MTY1MDE4MTYwN30.7_035TwjtsjhoA4FaNmW8GdEMXBzv7_xlXUizVSlMig",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps([
                {
                    "comments": "None",
                    "id": 1,
                    "flock_age": 1,
                    "organization": None,
                    "sample_type": "Diagnostic",
                    "flock_age_unit": "Days",
                    "flagged": False,
                    "timestamp_added": "2022-04-09 04:05:47",
                    "validation_status": "Pending",
                    "entered_by_id": 1,
                    "measurement_values": [
                        {
                            "sample_id": 1,
                            "value": 1,
                            "timestamp_added": "2022-04-09 04:05:47",
                            "measurement_id": 1
                        },
                        {
                            "sample_id": 1,
                            "value": 2,
                            "timestamp_added": "2022-04-09 04:05:47",
                            "measurement_id": 2
                        },
                        {
                            "sample_id": 1,
                            "value": 5.247,
                            "timestamp_added": "2022-04-09 04:05:47",
                            "measurement_id": 3
                        }
                    ]
                }
            ])
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_request_data2():
    # Request (2)
    # GET http://127.0.0.1:3005/api/data/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/data/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg1OTYxLCJuYmYiOjE2NTAxODU5NjEsImV4cCI6MTY1MDE4OTU2MX0.fQTaIquMk9bU4MAoQBuEB94BM-gz7F3TvQ__0bSdxCk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_machine():
    # Post Machine
    # POST http://127.0.0.1:3005/api/machine/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/machine/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg5NjY2LCJuYmYiOjE2NTAxODk2NjYsImV4cCI6MTY1MDE5MzI2Nn0.9wq1wHVIcv5T40YxAxU8ExgDzL0vGEWF1YaLJ3cil5E",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machinetype_id": "1",
                "serial_number": "ABCD12345",
                "organization_id": "1"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_edit_machine():
    # Edit Machine
    # PUT http://127.0.0.1:3005/api/machine/1

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/machine/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machinetype_id": "1",
                "serial_number": "ABCD1234 edit",
                "organization_id": "1"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_machine():
    # Get Machine
    # GET http://127.0.0.1:3005/api/machine/3

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/machine/3",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg5NjY2LCJuYmYiOjE2NTAxODk2NjYsImV4cCI6MTY1MDE5MzI2Nn0.9wq1wHVIcv5T40YxAxU8ExgDzL0vGEWF1YaLJ3cil5E",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_delete_machine():
    # Delete Machine
    # DELETE http://127.0.0.1:3005/api/machine/3

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/machine/3",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjUwMTg5NjY2LCJuYmYiOjE2NTAxODk2NjYsImV4cCI6MTY1MDE5MzI2Nn0.9wq1wHVIcv5T40YxAxU8ExgDzL0vGEWF1YaLJ3cil5E",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_machine_type():
    # Post Machine Type
    # POST http://127.0.0.1:3005/api/machine/type/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/machine/type/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "name": "iStat 2"
            })
        )
        assert response.status_code == 200
        
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_edit_machine_type():
    # Edit Machine Type
    # PUT http://127.0.0.1:3005/api/machine/type/2

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/machine/type/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "name": "iStat 3"
            })
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_machine_type():
    # Get Machine Type
    # GET http://127.0.0.1:3005/api/machine/type/2

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/machine/type/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
            },
        )
        assert response.status_code == 200
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_machine_types():
    # Get Machine Types
    # GET http://127.0.0.1:3005/api/machine/type/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/machine/type/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_delete_machine_type():
    # Delete Machine Type
    # DELETE http://127.0.0.1:3005/api/machine/type/2

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/machine/type/2",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjM2NjkyLCJuYmYiOjE2NDk2MzY2OTIsImV4cCI6MTY0OTY0MDI5Mn0.Bjctorvsyt6JIycoAqkmW3bUE_oz6B8_JjU8RjHW-84",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_measurement():
    # Post Measurement
    # POST http://127.0.0.1:3005/api/measurement/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/measurement/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machine_id": 1,
                "measurementtype_id": 1
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_measurement2():
    # Post Measurement 2
    # POST http://127.0.0.1:3005/api/measurement/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/measurement/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machine_id": 1,
                "measurementtype_id": 2
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_measurement_3():
    # Post Measurement 3
    # POST http://127.0.0.1:3005/api/measurement/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/measurement/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machine_id": 1,
                "measurementtype_id": 3
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_measurement4():
    # Post Measurement 4
    # POST http://127.0.0.1:3005/api/measurement/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/measurement/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machine_id": 2,
                "measurementtype_id": 1
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')


def test_get_measurement():
    # Get Measurement
    # GET http://127.0.0.1:3005/api/measurement/1

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/measurement/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFhbmlzaGJoaXJ1ZEBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6MSwiaWF0IjoxNjQ5ODYzMjYwLCJuYmYiOjE2NDk4NjMyNjAsImV4cCI6MTY0OTg2Njg2MH0.0HZf04morJMsBE5Duh5i1L50Tdv7fcvU9C68Bo8720U",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_edit_measurement():
    # Edit Measurement
    # PUT http://127.0.0.1:3005/api/measurement/4

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/measurement/4",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "machine_id": 2,
                "measurementtype_id": 2
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_measurements():
    # Get Measurements
    # GET http://127.0.0.1:3005/api/measurement/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/measurement/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFhbmlzaGJoaXJ1ZEBnbWFpbC5jb20iLCJpZCI6Miwicm9sZSI6MSwiaWF0IjoxNjQ5ODYzMjYwLCJuYmYiOjE2NDk4NjMyNjAsImV4cCI6MTY0OTg2Njg2MH0.0HZf04morJMsBE5Duh5i1L50Tdv7fcvU9C68Bo8720U",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_delete_measurement():
    # Delete Measurement
    # DELETE http://127.0.0.1:3005/api/measurement/1

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/measurement/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_post_measurement_type():
    # Post Measurement Type
    # POST http://127.0.0.1:3005/api/measurement/type/

    try:
        response = requests.post(
            url="http://127.0.0.1:3005/api/measurement/type/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "abbreviation": "GLOB",
                "units": "g/dL",
                "name": "Globulin",
                "required": "True",
                "general": "True"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_measurement_type():
    # Get Measurement Type
    # GET http://127.0.0.1:3005/api/measurement/type/1

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/measurement/type/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_edit_measurement_type():
    # Edit Measurement Type
    # PUT http://127.0.0.1:3005/api/measurement/type/1

    try:
        response = requests.put(
            url="http://127.0.0.1:3005/api/measurement/type/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
                "Content-Type": "application/json; charset=utf-8",
            },
            data=json.dumps({
                "abbreviation": "GLOB E",
                "units": "g/dL",
                "name": "Globulin edit",
                "required": "True",
                "general": "False"
            })
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_get_measurement_types():
    # Get Measurement Types
    # GET http://127.0.0.1:3005/api/measurement/type/

    try:
        response = requests.get(
            url="http://127.0.0.1:3005/api/measurement/type/",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')



def test_delete_measurement_type():
    # Delete Measurement Type
    # DELETE http://127.0.0.1:3005/api/measurement/type/1

    try:
        response = requests.delete(
            url="http://127.0.0.1:3005/api/measurement/type/1",
            headers={
                "Cookie": "pbr_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFiaGlydWRAbmNzdS5lZHUiLCJpZCI6MSwicm9sZSI6MCwiaWF0IjoxNjQ5NjQxOTA5LCJuYmYiOjE2NDk2NDE5MDksImV4cCI6MTY0OTY0NTUwOX0.-CwUKdIc02iylsmaMcSlKJvgO0P0VjpPd55hZ16ouIk",
            },
        )
        assert response.status_code == 200
        print('Response HTTP Response Body: {content}'.format(
            content=response.content))
    except requests.exceptions.RequestException:
        print('HTTP Request failed')
        
def test_allowed_roles():
    roles = []
    roles.append(0)
    roles.append(1)
    roles.append(2)
    try:
       APIUserController.allowed_roles(roles) 
    except requests.exceptions.RequestException:
        print('failed')