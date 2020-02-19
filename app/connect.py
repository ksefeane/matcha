from app import db


def test(name, email):
	sql = ("INSERT INTO users (username, email) VALUES (?, ?)")
	values = (name, email)
	db.add(sql, values)
	return "user added"

