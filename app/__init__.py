from flask import Flask
from config import Config
from db import DB

app = Flask(__name__)
app.config.from_object(Config)
db = DB(Config.logins, Config.db)

from app import routes

