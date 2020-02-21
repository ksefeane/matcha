import click
from flask import Flask
from app import app, db
from app.tables import TABLES

@app.cli.command("create", help='Initialize Database')
@click.argument("db_name")
def create_db(db_name):
	msg = db.init_db(db_name)
	print(msg)

@app.cli.command("kill", help='Destroy Database')
def destroy_db():
	msg = db.destroy_db(db.db['db'])
	print(msg)

@app.cli.command("refresh", help='Update Tables')
def update():
	msg = db.create_t(TABLES)
	print(msg[:-1])

@app.cli.command("init", help='Initialize Database (with Tables)')
def init_db():
	msg = db.init_db(db.db['db'])
	msg += db.create_t(TABLES)
	print(msg[:-1])

@app.cli.command("r", help='Destroy & Re-Initialize Database (with tables)')
def refresh():
	msg = db.destroy_db(db.db['db'])
	msg += db.init_db(db.db['db'])
	msg += db.create_t(TABLES)
	print(msg[:-1])
