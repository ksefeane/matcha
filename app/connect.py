from app import db


def test(values):
	sql = ("INSERT INTO users (username, email) VALUES (%s, %s)")
	db.insert(sql, values)
	return "user added"

