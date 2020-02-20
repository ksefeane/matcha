from app import db


def test(t_name, values):
	sql = "INSERT INTO "
	sql += t_name
	sql += " (username, email) VALUES (%s, %s)"
	db.insert(sql, values)
	return "user added"

