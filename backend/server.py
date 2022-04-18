from src import app
from src.Models import db
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

@app.before_first_request
def create_tables():
    print("Creating database tables...")
    db.create_all()
    print("Done!")


if __name__ == "__main__":
    app.run(
        host= os.environ.get("SERVER_NAME"),
        debug= os.environ.get("DEBUG_MODE"),
        port = os.environ.get("BACKEND_PORT")
    )