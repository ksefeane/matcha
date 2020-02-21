from flask import render_template, flash, redirect, url_for
from app import app, db
from app.forms import LoginForm
from app.query import q

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html', title='home')

@app.route('/login', methods=['GET', 'POST'])
def login():
	form=LoginForm()
	if form.validate_on_submit():
		msg = q.insert("users", [form.username.data, form.password.data], ["username", "email"])
		flash('{}'.format(msg))
		return redirect(url_for('index'))
	return render_template('login.html', title='login', form=form)
