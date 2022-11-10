import subprocess
import os
from sre_constants import ASSERT_NOT
import sys
import pytest
import requests
import json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

def pytest_sessionstart(session):
    os.system("python initdb-dev.py pbrsuperadmin@ncsu.edu C0ck@D00dleD00")