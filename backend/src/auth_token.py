import json
import os
from datetime import datetime, timedelta, timezone
import jwt


# Token Graveyard.
BLACKLIST = []

"""
JWT Token Controller
Creates, invalidates, replaces, or decodes a token.
"""
class Auth_Token:
    @staticmethod
    def create_token(user):
        """
        Creates a token from a given user.
        :param user: user obwject to create a token for
        :returns: a JWT token for the user
        """
        now = datetime.now(tz=timezone.utc)
        token_data = {
            "email": user.email,
            "id": user.id,
            "role": user.role,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(minutes=int(os.environ.get("JWT_TTL")))
        }
        return Auth_Token.create_token_from_data(token_data)

    @staticmethod
    def create_token_from_data(token_data):
        """
        Helper, creating a token from a passed in payload
        :param token_data: the payload to encode
        :param 
        """

        token = jwt.encode(payload=token_data, key=os.environ.get("JWT_SECRET"), algorithm=os.environ.get("JWT_SIGN_ALGORITHM"))
        return token

    @staticmethod
    def invalidate_token(token):
        """
        Invalidates a token, stopping it from being used.
        :param token: the token to invalidate
        :returns: void
        """
        BLACKLIST.append(token)

    @staticmethod
    def replace_token(token):
        """
        Replaces a token, destroying the old one and replacing it with a new one.
        :param token: the old token to replace
        :returns: new token to take the place of the old one
        """
        print("Replacing token")
        payload = decode_token(token)
        now = datetime.now(tz=timezone.utc)
        payload["iat"] = now
        payload["nbf"] = now
        payload["exp"] = now + timedelta(minutes=int(os.environ.get("JWT_TTL")))
        invalidate_token(token)

        return Auth_Token.__create_token_from_data(payload)


    @staticmethod
    def decode_token(token):
        """
        Validates a token, ensuring it is original/signed and not expired.
        :param token: the token to validate
        :returns: token payload, or error if token is invalid or expired
        """

        try:
            # Check Token Graveyard to see if this is an Invalid Token
            if token in BLACKLIST:
                raise jwt.InvalidTokenError

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


