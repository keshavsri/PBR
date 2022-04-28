from src import app
from src.Models import User, db
import src.Models as Models
import os
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())

if __name__ == "__main__":
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )
