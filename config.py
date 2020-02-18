import os

class Config(object):
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'wtc-matcha'


admin = {'user': 'ksefeane','host': 'localhost','password': 'qamagru'}
db = {'db' : 'matcha_db'}
