from src import app
from src.models import User, db
import src.models as models
import os
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())

if __name__ == "__main__":
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )
