from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, EqualTo

class LoginForm(FlaskForm):
	username = StringField('Username', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired()])
	submit = SubmitField('login')

class Sign_upForm(FlaskForm):
	username = StringField('Username', validators=[DataRequired()])
	email = StringField('Email', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired(), EqualTo('password2', message='passwords must match')])
	password2 = PasswordField('Password2', validators=[DataRequired()])
	submit = SubmitField('sign_up')

class RegisterForm(FlaskForm):
	first_name = StringField('First_name', validators=[DataRequired()])
	last_name = StringField('Last_name', validators=[DataRequired()])
	gender = StringField('Gender', validators=[DataRequired()])
	orientation = StringField('Orientation', validators=[DataRequired()])
	preference = StringField('Preference', validators=[DataRequired()])
	interests = StringField('Interests', validators=[DataRequired()])
	bio = StringField('Bio', validators=[DataRequired()])
	submit = SubmitField('register')
