import mysql.connector
from mysql.connector import errorcode

class DB:
	def __init__(self, logins, db):
		self.connex = mysql.connector.connect(**logins)
		self.curex = self.connex.cursor()
		self.conn = mysql.connector.connect(**logins, **db)
		self.cur = self.conn.cursor(prepared=True)

	def add(self, sql, values):
		self.cur.execute(sql, values)
		self.conn.commit()
		self.cur.close()
		self.conn.close()

