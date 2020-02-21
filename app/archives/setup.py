import mysql.connector
from mysql.connector import errorcode
from tables import DB_NAME, TABLES, create_database
from admin import values

cnx = mysql.connector.connect(**values)
cursor = cnx.cursor()

def conn():
	cnx = mysql.connector.connect(**values, db=DB_NAME)
	return cnx

def close():
	cursor.close()
	cnx.close()


try:
	cursor.execute("USE {}".format(DB_NAME))
	print("Database: {}".format(DB_NAME))
except mysql.connector.Error as err:
		print("Database {} does not exist".format(DB_NAME))
		if err.errno == errorcode.ER_BAD_DB_ERROR:
			create_database(cursor)
			print("Database {} created successfully".format(DB_NAME))
			cnx.databse = DB_NAME
			cursor.execute("USE {}".format(DB_NAME))
		else:
			print(err)
			exit(1)

for table_name in TABLES:
	description = TABLES[table_name]
	try:
		print("Table: {} ".format(table_name), end='')
		cursor.execute(description)
	except mysql.connector.Error as err:
		if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
			print("(found)")
		else:
			print(err.msg)

	else:
		print("(created)")

cursor.execute("USE {}".format(DB_NAME))

cursor.close()
cnx.close()
