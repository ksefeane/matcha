from flask import render_template, flash, redirect, url_for
from app import app
from app.forms import LoginForm
from app.db import get_db
from flask import current_app

@app.route('/')
@app.route('/index')
def index():
	cnx = get_db()
	cur = cnx.cursor()
	cur.execute("SELECT * FROM users")
	data = cur.fetchall()
	return render_template('index.html', title='home', data=data)

@app.route('/login', methods=['GET', 'POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		flash('{} login request'.format(form.username.data))
		return redirect(url_for('index'))
	return render_template('login.html', title='login', form=form)
