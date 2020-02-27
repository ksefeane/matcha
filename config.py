import os

class Config(object):
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'wtc-matcha'
	logins = {'user': 'ksefeane','host': 'localhost','password': 'qamagru'}
	db = {'db' : 'matcha_db'}
	MAIL_SERVER = '127.0.0.1'
	MAIL_PORT = '5000'
	MAIL_USE_TLS = False
	MAIL_USE_SSL = False
	MAIL_DEBUG = False
	MAIL_USERNAME = 'matcha'
	MAIL_PASSWORD = None
	MAIL_DEFAULT_SENDER = 'matcha@matcha.com'
