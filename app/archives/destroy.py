import mysql.connector
from mysql.connector import errorcode
from tables import DB_NAME, TABLES, create_database, destroy_database

cnx = mysql.connector.connect(
		user='ksefeane',
		password='qamagru',
		host='localhost')
cursor = cnx.cursor()

try:
	destroy_database(cursor)
	print("Database {} destroyed successfully".format(DB_NAME))
except mysql.connector.Error as err:
		print("Database {} does not exist".format(DB_NAME))

cursor.close()
cnx.close()
