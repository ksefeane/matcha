from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
import secrets

class q:
	def insert(t_name, params, values):
		x = ''
		for y in params:
			x += '%s,'
		x = x[:-1]
		sql = "INSERT INTO " + t_name
		sql += '(' + ','.join(params) + ')'
		sql += " VALUES (" + x + ")"
		db.insert(sql, values)
		return "{} inserted into {}".format(values, t_name)

	def fetchall(t_name, values):
		sql = "SELECT "
		sql += values
		sql += " FROM " + t_name
		data = db.fetchall(sql)
		data = str(data)
		return data

	def fetchone(t_name, res, params, pvalue):
		sql = "SELECT "
		sql += res
		sql += " FROM " + t_name
		sql += " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		data = db.fetchone(sql)
		return data

	def fetchrow(t_name, res, params, pvalue):
		sql = "SELECT "
		sql += res
		sql += " FROM " + t_name
		sql += " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		try:
			data = db.fetchall(sql)
			return data[0]
		except:
			return None

	def delrow(t_name, param, value):
		sql = "DELETE FROM " + t_name
		sql += " WHERE " + param + "=\'" + value + "\'"
		db.connect(sql)
		msg = "row deleted"
		return msg

class user:
	def __init__(self):
		self.user = None
		self.token = None

	def sign_up(self, values):
		params = ["username", "email", "password"]
		verify = [params[0], params[1]]
		err = {}
		for x, y in zip(verify, values):
			if q.fetchone("users", x, x, y) is not None:
				err[x] = " not available"
		if bool(err):
			return err
		values[2] = customs.set_pass(values[2])
		q.insert("users", params, values)
		return "success"

	def login(self, values):
		res = q.fetchrow("users", "id, password", "username", values[0])
		if res is None:
			return "username or password incorrect"
		ver = customs.check_pass(res[1], values[1])
		if ver is False:
			return "username or password incorrect"
		tok = secrets.token_hex(50)
		q.insert("tokens", ["user_id", "token"], [res[0], tok])
		session['user'] = values[0]
		session['token'] = tok
		self.user = values[0]
		self.token = tok
		return ver

	def logout(self):
		if 'token' in session:
			tok = session['token']
			session.pop('token', None)
			tok = q.delrow("tokens", "user_id", "1")
		return tok + " logged out"

	def register(self, values):
		params = ["user_id", "first_name", "last_name", "gender", "orientation", "preference", "interests", "bio"]
		res = q.fetchrow("tokens", "user_id", "token", session['token'])
		if res is None:
			return "error"
		values.insert(0, res[0])
		q.insert("profiles", params, values)
		return "success"

class customs:
	def set_pass(password):
		pash = generate_password_hash(password)
		return pash

	def check_pass(db_pass, password):
		res = check_password_hash(db_pass, password)
		return res
