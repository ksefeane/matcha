from app.models import q
from flask_restful import Resource

class look(Resource):
	def get(self, name):
		res = q.fetchall(name, "*")
		return res
