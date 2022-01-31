from flask import Flask, request
from server import app

USERS = [
  {
    "id": "1",
    "username": "aaronp",
    "email": "arpenny@ncsu.edu"
  }
]
@app.route("/api/users", methods=['GET'])
def get_users():
    return USERS