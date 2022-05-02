# test_auth_token.py
# Tests JWT Auth Token Creation/Parsing
from lib2to3.pgen2 import token
import os
from sre_constants import ASSERT_NOT
import sys
import pytest
import bcrypt
import time
from datetime import datetime, timedelta, timezone
import jwt
from unittest import mock
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src import Models
from src.enums import Roles
from src.auth_token import Auth_Token, BLACKLIST


#unit test for invalid create token
def test_create_token_error():
    with pytest.raises(TypeError):
      assert  Auth_Token.create_token()

#unit test for invalidating a nonexistant token
def test_invalidate_token_error():
    with pytest.raises(TypeError):
        assert Auth_Token.invalidate_token()

#unit test for invalid replace
def test_replace_token_error():
    with pytest.raises(TypeError):
        assert Auth_Token.replace_token()

#unit test for invalid decode
def test_decode_token_error():
    with pytest.raises(TypeError):
        assert Auth_Token.decode_token()


#unit test for the create token functionality
def test_create_token():       
    now = datetime.now(tz=timezone.utc) 
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=int(60))
        }
    testingToken = Auth_Token.create_token_from_data(token_data)
    print(testingToken)
    index = testingToken.find("administrator@ncsu.edu")
    print(index)
    assert user.email == "administrator@ncsu.edu"

#unit test for blacklisting a token    
def test_blacklist_token():       
    now = datetime.now(tz=timezone.utc) 
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=int(60))
        }
    testingToken = Auth_Token.create_token_from_data(token_data)
    Auth_Token.invalidate_token(testingToken)
    invalidToken = BLACKLIST.pop()
    assert invalidToken == testingToken
    
#unit test for blacklisting and decoding a token    
def test_blacklist_and_decode_token():       
    now = datetime.now(tz=timezone.utc) 
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=int(60))
        }
    testingToken = Auth_Token.create_token_from_data(token_data)
    Auth_Token.invalidate_token(testingToken)
    with pytest.raises(jwt.InvalidTokenError):
        Auth_Token.decode_token(testingToken)
        
#unit test for decoding an expired token  
def test_decode_expired_token():       
    now = datetime.now(tz=timezone.utc) 
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(seconds=int(1))
        }
    testingToken = Auth_Token.create_token_from_data(token_data)
    time.sleep(2)
    with pytest.raises(jwt.InvalidTokenError):
        Auth_Token.decode_token(testingToken)
 
#unit test for the replace token function     
def test_replace_token():       
    now = datetime.now(tz=timezone.utc) 
    url = "http://localhost:3000/register"
    salt = bcrypt.gensalt()
    hashedPW = bcrypt.hashpw("password".encode('utf8'), salt)
    temp = dict(
        email="administrator@ncsu.edu",
        firstname = "gavin",
        lastname = "dacier",
        password = hashedPW.decode(),
        role = Roles.Admin,
    )
    data=temp
    user = Models.User(email=data["email"], first_name=data["firstname"], last_name=data["lastname"], password=hashedPW.decode(), role=Roles.Admin )
    token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=int(60))
        }
    testingToken = Auth_Token.create_token_from_data(token_data)
    with pytest.raises(jwt.InvalidTokenError):
        newToken = Auth_Token.replace_token(testingToken)


