from flask import render_template, flash, redirect, url_for, session, g
from app import app, db, u
from app.forms import LoginForm, Sign_upForm
from app.models import q


@app.route('/')
@app.route('/index')
def index():
	data = q.fetchone("users", "password", "username", "le roux")
	return render_template('index.html', title='home', u=u, data=data)

@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
	form=Sign_upForm()
	if form.validate_on_submit():
		msg = u.sign_up([form.username.data, form.email.data, form.password.data])
		flash('{}'.format(msg))
		if msg == "success":
			return redirect(url_for('login'))
	return render_template('sign_up.html', title='sign_up', u=u, form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		msg = u.login([form.username.data, form.password.data])
		flash('{} logged in'.format(u.user))
		return redirect(url_for('index'))
	return render_template('login.html', title='login', u=u, form=form)

@app.route('/logout')
def logout():
	if u.user:
		flash('{} logged out'.format(u.user))
		u.logout()
		return redirect(url_for('index'))
	return redirect(url_for('login'))


@app.route('/tables')
def tables():
	users = q.fetchall("users", "*")
	profiles = q.fetchall("profiles", "*")
	images = u.user
	return render_template('tables.html', u=u, title='tables', users=users, profiles=profiles, images=images)
