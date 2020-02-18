import mysql.connector
import click

from flask import current_app, g
from flask.cli import with_appcontext
from config import admin, db

def get_db():
	if 'db' not in g:
		g.db = mysql.connector.connect(**admin, **db)
	return g.db

def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
