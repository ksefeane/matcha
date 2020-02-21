from db import conn

cnx = conn()
cursor = cnx.cursor()

add_user = ("INSERT INTO users (username, email) VALUES ('joe', 'joe@gmail.com')")
cursor.execute(add_user)
cnx.commit()
print("user added")
cursor.close()
cnx.close()

