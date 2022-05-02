#This file tests some of the functions involved in parsing vetscan2 data
import os
from sre_constants import ASSERT_NOT
import sys
import bcrypt
import pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src import Models
from src.enums import Roles
from src.api import APIDataController
        
#tests a valid filename        
def test_valid_file_type():
    assert APIDataController.check_allowed_filetype("valid.txt")
    
#tests an invalid filetype
def test_invalid_file_type():
    with pytest.raises(Exception):
        APIDataController.parse("invalid_filetype.pdf")
        
#tests an invalid file name
def test_invalid_file_name():
    with pytest.raises(Exception):
        APIDataController.parse(".txt")
 
#unit test for parsing vs2   
def test_valid_parse_vetscan_vs2():
    content_lines = []
    content_lines.append("vetscanv2")
    content_lines.append("Avian/Reptilian Profile Plus")
    content_lines.append("15 Oct 2021           08:39 AM")
    content_lines.append("Sample Type:             Other")
    content_lines.append("Patient ID:           101521-5")
    content_lines.append("Rotor Lot Number:      1104AC0")
    content_lines.append("Serial Number:      0000V33943")
    content_lines.append("..............................")
    content_lines.append("AST     284                U/L")
    content_lines.append("BA    <  35 *           umol/L")
    content_lines.append("CK     3429                U/L")
    content_lines.append("UA      1.8              mg/dL")
    content_lines.append("GLU     257              mg/dL")
    content_lines.append("CA     11.2              mg/dL")
    content_lines.append("PHOS    7.5              mg/dL")
    content_lines.append("TP      3.7               g/dL")
    content_lines.append("ALB     2.1               g/dL")
    content_lines.append("GLOB    1.6               g/dL")
    content_lines.append("K+      4.0             mmol/L")
    content_lines.append("NA+     152             mmol/L")
    content_lines.append("                              ")
    content_lines.append("QC     OK                     ")
    content_lines.append("HEM 0     LIP 2+    ICT 0     ")
    APIDataController._parse_vetscan_vs2(content_lines)
    # assert APIDataController._is_error_file
    
#directly tests is_error_file function
def test_is_error_file():
    content_lines = []
    content_lines.append("vetscanv2")
    content_lines.append("Avian/Reptilian Profile$^Plus")
    with pytest.raises(Exception):
        APIDataController._is_error_file(content_lines)
 
#unit test for invalid get_batches call       
def test_get_batches_none():
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
    with pytest.raises(Exception):
        APIDataController.get_batches(True, user)