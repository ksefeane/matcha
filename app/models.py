from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class q:
	def insert(t_name, values, params):
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
		data = db.fetchall(sql)
		if data is None:
			return None
		return data[0]

class user:
	def sign_up(values):
		params = ["username", "email", "password"]
		verify = [params[0], params[1]]
		err = {}
		for x, y in zip(verify, values):
			if q.fetchone("users", x, x, y) is not None:
				err[x] = " not available"
		if bool(err):
			return err
		values[2] = customs.set_pass(values[2])
		res = q.insert("users", values, params)
		return "success"

class customs:
	def set_pass(password):
		pash = generate_password_hash(password)
		return pash

	def check_pass(db_pass, password):
		res = check_password_hash(db_pass, password)
		return res
