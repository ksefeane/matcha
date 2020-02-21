import mysql.connector
from tables import DB_NAME
from admin import values
from flask import g
from flask.cli import with_appcontext
def conn():
	if 'db' not in g:
		with app.app_context():
			g.db = mysql.connector.connect(**values, db=DB_NAME)
	return g.db

