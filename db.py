import mysql.connector

class DB:
	def __init__(self, logins, db):
		self.conn = mysql.connector.connect(**logins, **db)
		self.cur = self.conn.cursor()

	def add(self, sql):
		self.cur.execute(sql)
		self.conn.commit()
		self.cur.close()
		self.conn.close()

