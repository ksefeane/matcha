from flask import Flask
from config import Config
from db import DB
from flask_restful import Api

app = Flask(__name__)
app.config.from_object(Config)
db = DB(Config.logins, Config.db)
api = Api(app)

from app.models import user
u = user()
from app import commands
from app import routes
from app.apis import look

api.add_resource(look, '/api/<name>')
