from flask import render_template, flash, redirect, url_for, session, g
from app import app, db, u
from app.forms import LoginForm, Sign_upForm, RegisterForm
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
		flash('{} logged in'.format(session['token']))
		return redirect(url_for('register'))
	return render_template('login.html', title='login', u=u, form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
	form=RegisterForm()
	if form.validate_on_submit():
		values = [
			form.first_name.data,
			form.last_name.data, 
			form.gender.data, 
			form.orientation.data, 
			form.preference.data, 
			form.interests.data, 
			form.bio.data]
		msg = u.register(values)
		flash('{}'.format(msg))
		if msg == "success":
			return redirect(url_for('tables'))
	return render_template('register.html', title='sign_up', u=u, form=form)

@app.route('/logout')
def logout():
	if session['token']:
		msg = u.logout()
		flash('{}'.format(msg))
		return redirect(url_for('login'))
	return redirect(url_for('index'))


@app.route('/tables')
def tables():
	users = q.fetchall("users", "*")
	profiles = q.fetchall("profiles", "*")
	images = q.fetchall("tokens", "*")
	return render_template('tables.html', u=u, title='tables', users=users, profiles=profiles, images=images)
