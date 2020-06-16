const DB = require('./dbModel')

var query = function() {}

query.insert = (t_name, params, values, callback) => {
	var v = ''
	for (let p in params)
		v += '?, '
	v = v.slice(0, -2)
	var sql = "INSERT INTO " + t_name + " (" + params.join() + ") " +
		"VALUES " + "(" + v + ")"
	DB.insert(sql, values, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.delone = (t_name, params, pval, callback) => {
	var sql = "DELETE FROM "+t_name+" WHERE "+params+"=\'"+pval+"\'"
	DB.insert(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.update = (t_name, sets, values, param, pval, callback) => {
	var z = ''
	for (let s in sets)
		z += sets[s]+"=?, "
	z = z.slice(0, -2)
	var sql = "UPDATE "+t_name+" SET "+z+" WHERE "+param+"=\'"+pval+"\'"
	DB.insert(sql, values, (err, res) => {
		if (err)
			callback("failed to update", null)
		else
			callback(null, "updated")
	})
}


query.fetchall = (t_name, callback) => {
	var sql = "SELECT * FROM " + t_name
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.fetchone = (t_name, val, params, pval, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "+params+"=\'"+pval+"\'"
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

/**
 * Suggestions based on users age OR gender OR location
 *
 * These suggestions are exact match suggestions except for the age suggestion.
 * That suggestion gives you all users that are between 5 years older or younger than the user
 *
 * @param user
 * @param callback
 */
query.fetchGenericSugestions= (user, callback) => {
	const sql = "select p.* from profiles p " +
		"where" +
		"( p.age BETWEEN (select f.age from profiles f where f.username = '"+user +"')-10  AND " +
		"(select f.age from profiles f where f.username = '"+user +"')+10)" +
		"or p.gender = ( select g.gender from profiles g where g.username = '"+user +"')" +
		"or p.location = ( select x.location from profiles x where x.username = '"+user +"')";

	console.log('sql statement :: '+sql)
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else{
			callback(null, res)
		}
	})
}

module.exports = query
