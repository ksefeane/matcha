import mysql.connector
from mysql.connector import errorcode

class DB:
	def __init__(self, logins, db):
		self.logins = logins
		self.db = db
		try:
			self.connex = mysql.connector.connect(**logins, **db)
		except: 
			self.connex = mysql.connector.connect(**logins)
		self.cursex = self.connex.cursor()
		
	def create_db(self, db_name):
		try:
			self.cursex.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(db_name))	
			self.cursex.execute("USE {}\n".format(db_name))
			self.cursex.database = db_name
			self.cursex = self.connex.cursor(prepared=True)
			msg = "Database {} created successfully\n".format(db_name)
		except mysql.connector.Error as err:
			msg = "Failed to create Database: {}. error {}\n".format(db_name, err.msg)
		return msg

	def init_db(self, db_name):
		try:
			msg = "Database {} already exists\n".format(db_name)
			self.cursex.execute("USE {}\n".format(db_name))
		except mysql.connector.Error as err:
			msg = "Database: {} does not exist\n".format(db_name)
			if err.errno == errorcode.ER_BAD_DB_ERROR:
				msg += self.create_db(db_name)
			else:
				try:
					self.create_db(db_name)
				except:
					return err
		return msg
			
	def create_t(self, tables):
		for t_name in tables:
			sql = tables[t_name]
			try:
				msg = "Table {} ".format(t_name)
				self.cursex.execute(sql)
			except mysql.connector.Error as err:
				if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
					x = "(found)"
				else:
					x = err.msg
			else:
				x = "(created)"
			
			z = msg + x
		return z
			

	def destroy_db(self, db_name):
		try:
			self.cursex.execute("DROP DATABASE {}".format(db_name))
			return "{} destroyed".format(db_name)
		except mysql.connector.Error as err:
			return "failed to destroy {}. error {}".format(db_name, err.msg)

	def insert(self, sql, values):
		self.cursex.execute(sql, values)
		self.connex.commit()

	def close(self):
		self.cursex.close()
		self.connex.close()
