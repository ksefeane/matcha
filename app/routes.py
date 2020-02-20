from flask import render_template, flash, redirect, url_for
from app import app, db
from app.forms import LoginForm
from app.connect import test
from app.query import q
from app.tables import TABLES

@app.route('/')
@app.route('/index')
def index():
	values = ["le roux", "le roux@mailinator.com"]
	params = ["username", "email"]
	data = q.insert("users", values, params)
	return render_template('index.html', title='home', data=data)

@app.route('/setup')
def setup():
	db_name = "matcha_db"
	db_name = db.init_db(db_name)
	return render_template('setup.html', title='setup', db_name=db_name)
	
@app.route('/table')
def table():
	db_name = db.create_t(TABLES)
	return render_template('setup.html', title='setup', db_name=db_name)

@app.route('/destroy')
def destroy():
	db_name = "matcha_db"
	db_name = db.destroy_db(db_name)
	return render_template('setup.html', title='destroy', db_name=db_name)

@app.route('/login', methods=['GET', 'POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		flash('{} login request'.format(form.username.data))
		return redirect(url_for('index'))
	return render_template('login.html', title='login', form=form)
