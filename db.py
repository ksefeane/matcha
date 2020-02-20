import mysql.connector
from mysql.connector import errorcode

class DB:
	def __init__(self, logins, db):
		self.logins = logins
		self.db = db
		self.connex = mysql.connector.connect(**logins)
		self.cursex = self.connex.cursor()
		
	def create_db(self, db_name):
		try:
			self.cursex.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(db_name))	
			self.connex = mysql.connector.connect(self.logins, self.db)
			self.cursex = self.connex.cursor(prepared=True)
			return "{} Database created successfully".format(db_name)
		except mysql.connector.Error as err:
			return "Failed to create Database: {}. error {}".format(db_name, err.msg)

	def init_db(self, db_name):
		try:
			self.cursex.execute("USE {}".format(db_name))
			return "Database {}".format(db_name)
		except mysql.connector.Error as err:
			msg = "Database: {} does not exist ".format(db_name)
			if err.errno == errorcode.ER_BAD_DB_ERROR:
				self.create_db(db_name)
				msg = ("Database {} created successfully?".format(db_name))
				return msg
			else:
				return err
				

	def destroy_db(self, db_name):
		try:
			self.cursex.execute("DROP DATABASE {}".format(db_name))
			return "{} destroyed".format(db_name)
		except mysql.connector.Error as err:
			return "failed to destroy {}. error {}".format(db_name, err.msg)

	def insert(self, sql, values):
		self.cursex.execute(sql, values)
		self.connex.commit()
		self.cursex.close()
		self.connex.close()


