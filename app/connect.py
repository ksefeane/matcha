from app import db


def test():
	add_user = ("INSERT INTO users (username, email) VALUES ('joe', 'joe@gmail.com')")
	db.add(add_user)
	return "user added"

