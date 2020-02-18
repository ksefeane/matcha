import os

from flask import Flask
#from flaskext.mysql import MySQL
from config import Config

#app = Flask(__name__)
#mysql = MySQL()
#app.config.from_object(Config)
#mysql.init_app(app)


#from app import routes

def create_app():
	app = Flask(__name__, instance_relative_config=True)
	app.config.from_mapping(
			SECRET_KEY = 'dev',
			DATABASE = os.path.join(app.instance_path, 'matcha.sql')
	)
	app.config.from_object(Config)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass
	
	@app.route('/')
	@app.route('/hello')
	def hello():
		return 'hello world'

	return app
