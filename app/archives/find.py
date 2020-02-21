from admin import USER, HOST, PASS, DB
import mysql.connector

cnx = mysql.connector.connect(
		user=USER, 
		password=PASS, 
		host=HOST, 
		database=DB)
cursor = cnx.cursor()

user = ("SELECT id, username, email FROM users WHERE username='joe'")
cursor.execute(user)
data = cursor.fetchall()

cursor.close()
cnx.close()
