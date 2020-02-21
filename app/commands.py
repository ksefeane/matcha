import click
from flask import Flask
from app import app, db
from app.tables import TABLES

@app.cli.command("create")
@click.argument("db_name")
def create_db(db_name):
	msg = db.init_db(db_name)
	print(msg)

@app.cli.command("destroy")
@app.cli.command("kill")
def destroy_db():
	msg = db.destroy_db(db.db['db'])
	print(msg)

@app.cli.command("refresh")
@app.cli.command("init")
@app.cli.command("initialize")
def init_db():
	msg = db.init_db(db.db['db'])
	msg += db.create_t(TABLES)
	print(msg)
