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
		sql = "INSERT INTO " + t_name + '(' + ','.join(params) + ')'
		sql += " VALUES (" + x + ")"
		db.insert(sql, values)
		return "{} inserted into {}".format(values, t_name)

	def update(t_name, sets, values, param, pval):
		z = ''
		for x in sets:
			z += x + "=%s,"
		z = z[:-1]
		sql = "UPDATE " + t_name
		sql += " SET " + z
		sql += " WHERE " + param + "=" + "\'" + pval +"\'"
		db.insert(sql, values)
		return 1
	
	def fetchall(t_name, values):
		sql = "SELECT " + values + " FROM " + t_name
		data = db.fetchall(sql)
		data = str(data)
		return data

	def fetchone(t_name, res, params, pvalue):
		sql = "SELECT " + res + " FROM " + t_name + " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		data = db.fetchone(sql)
		return data

	def fetchrow(t_name, res, params, pvalue):
		sql = "SELECT " + res + " FROM " + t_name + " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		try:
			data = db.fetchall(sql)
			return data[0]
		except:
			return None

	def delrow(t_name, param, value):
		sql = "DELETE FROM " + t_name + " WHERE " + param + "=\'" + value + "\'"
		db.connect(sql)
		msg = "row deleted"
		return msg


class user:
	def __init__(self):
		self.user = None

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
		customs.check_token(res[0])
		self.user = values[0]
		return ver

	def logout(self):
		if 'token' in session:
			tok = session['token']
			q.delrow("tokens", "token", session['token'])
			session.pop('token', None)
		return tok + " logged out"

	def register(self, values):
		params = ["first_name", "last_name", "gender", "orientation", "preference", "interests", "bio"]
		res = q.fetchrow("tokens", "user_id", "token", session['token'])
		if res is None:
			return "error"
		res = str(res[0])
		found = q.fetchrow("profiles", "user_id", "user_id", res)
		if found is not None:
			q.update("profiles", params, values, "user_id", res)
		else:
			params.insert(0, "user_id")
			values.insert(0, res)
			q.insert("profiles", params, values)
		return "success"

class customs:
	def set_pass(password):
		pash = generate_password_hash(password)
		return pash

	def check_pass(db_pass, password):
		res = check_password_hash(db_pass, password)
		return res

	def check_token(user_id):
		user_id = str(user_id)
		res = q.fetchrow("tokens", "token", "user_id", user_id)
		if res is None:
			tok = secrets.token_hex(50)
			q.insert("tokens", ["user_id", "token"], [user_id, tok])
			session['token'] = tok
			return tok
		session['token'] = res[0]
		return res[0]
