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
		return data

	def fetchone(t_name, res, params, pvalue):
		sql = "SELECT "
		sql += res
		sql += " FROM " + t_name
		sql += " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		data = db.fetchone(sql)
		data = convert.ltos(data)
		return data

	def fetchrow(t_name, res, params, pvalue):
		sql = "SELECT "
		sql += res
		sql += " FROM " + t_name
		sql += " WHERE " + params + "="
		sql += "\'" + pvalue + "\'"
		data = db.fetchall(sql)
		return data

class v:
	def set_pass(password):
		pash = generate_password_hash(password)
		return pash

	def check_pass(db_pass, password):
		res = check_password_hash(db_pass, password)
		return res
	
	def sign_up(values):
		values[2] = v.set_pass(values[2])
		msg = q.insert("users", values, ["username", "email", "password"])
		return msg

class convert:
	def ltos(l):
		return ','.join(l)
