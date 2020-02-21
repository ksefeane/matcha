from app import db

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

	def fetch(t_name, values):
		sql = "SELECT "
		sql += values
		sql += " FROM " + t_name
		data = db.fetch(sql)
		return data

