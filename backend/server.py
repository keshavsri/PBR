from src import app
import os
from dotenv import load_dotenv, find_dotenv
from src.models import User, db
import src.models as models

load_dotenv(find_dotenv())

if __name__ == "__main__":
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )
