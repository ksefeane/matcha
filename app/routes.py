from flask import render_template, flash, redirect, url_for
from app import app, db
from app.forms import LoginForm, Sign_upForm
from app.models import q, v, verif

@app.route('/')
@app.route('/index')
def index():
	data = q.fetchone("users", "password", "username", "le roux")
	return render_template('index.html', title='home', data=data)

@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
	form=Sign_upForm()
	if form.validate_on_submit():
		msg = v.sign_up([form.username.data, form.email.data])
		flash('{}'.format(msg))
		return redirect(url_for('tables'))
	return render_template('sign_up.html', title='sign_up', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		msg = v.login(form.username.data, form.password.data)
		flash('{}'.format(msg))
		return redirect(url_for('index'))
	return render_template('login.html', title='login', form=form)


@app.route('/tables')
def tables():
	users = q.fetchall("users", "*")
	profiles = verif.check_col("users", ["username", "email"], ["kori", "kori@mailinator.com"])
	images = q.fetchall("images", "*")
	return render_template('tables.html', title='tables', users=users, profiles=profiles, images=images)
