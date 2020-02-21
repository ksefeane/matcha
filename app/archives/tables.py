DB_NAME = 'matcha_db'

def create_database(cursor):
	try:
		cursor.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
	except mysql.connector.Error as err:
		print("Failed to create database: {}".format(err))
		exit(1)

def destroy_database(cursor):
	try:
		cursor.execute("DROP DATABASE {}".format(DB_NAME))
	except mysql.connector.Error as err:
		print("Failed to drop database: {}".format(err))
		exit(1)

TABLES = {}

TABLES['users'] = (
		"CREATE TABLE `users` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `username` varchar(20) NOT NULL,"
		" `email` varchar(60) NOT NULL,"
		" PRIMARY KEY (`id`)"
		") ENGINE=InnoDB")
