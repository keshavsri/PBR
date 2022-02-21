import json
import os
from datetime import datetime, timedelta, timezone
import jwt

# Keys should only be active for 60 minutes
KEY_TTL=60 

def create_token(user):
    """Creates a token from a given user.
    :param user: user obwject to create a token for
    :returns: a JWT token for the user
    """
    print(f"Creating token for {user['email']}")
    print(user)
    now = datetime.now(tz=timezone.utc)
    token_data = {
        "email": user["email"],
        "id": user["id"],
        "role": user["role"],
        "iat": now,
        "nbf": now,
        "exp": now + timedelta(minutes=KEY_TTL)
    }

    token = jwt.encode(payload=token_data, key=os.environ.get("JWT_SECRET"), algorithm=os.environ.get("JWT_SIGN_ALGORITHM"))
    print("Created token: ", token)
    return token

def destroy_token(token):
    """Destroys a token, stopping it from being used.
    :param token: the token to destroy
    :returns: void
    """
    print("Destroying token")

def replace_token(token):
    """replaces a token, destroying the old one and replacing it with a new one.
    :param token: the old token to replace
    :returns: new token to take the place of the old one
    """
    print("Replacing token")

def decode_token(token):
    """Validates a token, ensuring it is original/signed and not expired.
    :param token: the token to validate
    :returns: token payload, or error if token is invalid or expired
    """

    try:
        header_data = jwt.get_unverified_header(token)
        payload = jwt.decode(token, key=os.environ.get("JWT_SECRET"), algorithms=[os.environ.get("JWT_SIGN_ALGORITHM")])
        print(f'Token valid.')
        return payload
    except jwt.ExpiredSignatureError as error:
        print(f'Token expired. {error}')
        raise
    except jwt.InvalidTokenError as error:
        print(f'Invalid Token. {error}')
        raise


