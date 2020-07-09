const Q = require('./queryModel')
var Mutex = require('async-mutex').Mutex
var Semaphore = require('async-mutex').Semaphore
var withTimeout = require('async-mutex').withTimeout
var S = require('./securityModel')

var Browse = function(){}

Browse.popularity = (match, callback) => {
	Q.fetchone("visits", ['visited'], 'visited', match, (err, a) => {
  		if (err)
  			callback(err)
		else if (a.length > 0) {
			var pop = 0
			Q.fetchone("likes", ['liked'], 'liked', match, (err, b) => {
				if (err)
					callback(err)
				else if (b && b.length > 0) 
					pop = (b.length/a.length)*10
				Q.update("profiles", ['popularity'], pop, 'username', match, (err, res) => {
					if (err)
						callback(err)
					else
						callback(null, `${pop}/10 rating`)
				})
			})
		}
	})
}

Browse.visit = (user, match, callback) => {
	var par = ['visitor', 'visited', 'year', 'month']
	var msg = `${user} visited ${match}`
	var t = new Date()
	Q.fetchoneMRows("visits", ['visited'], ['visitor', 'visited', 'month'], [user, match, t.getMonth()], (err, data) => {
		if (data && data.length > 0) {
				callback(null, `${msg} again`)
		} else {
			Q.insert("visits", par, [user, match, t.getFullYear(), t.getMonth()], (err, result) => {
				if (err)
					callback(err)
				else {
					Browse.popularity(match, (err, res) => {
						if (err)
							callback(err)
						else
							callback(null, `${msg} (${res})`)
					})
				}
			})
		}
	})
}

Browse.suspend = (user, admin, callback) => {
	var params = ['suspended']
	let promise = new Promise ((resolve, reject) => {
		Q.fetchone("profiles", params, 'username', user, (err, res) =>{
			if (res && res.length > 0) {
				var val = (res[0].suspended) ? 0 : 1
				resolve(val)
			} else {
				callback(JSON.stringify({error: `user ${user} not found`}), null)
			}
		})
	})
	promise.then(val => {
		Q.update("profiles", params, val, 'username', user, (err,res) => {
			if (err) {
				console.log(err)
				callback(JSON.stringify({error: err}), null)
			}
			else if (val === 1) {
				console.log(`${admin} suspended ${user}`)
				callback(null, JSON.stringify({label:"suspension status", value:"1", initiator:admin, user:user}))
			}
			else {
				console.log(`${admin} unsuspended ${user}`)
				callback(null, JSON.stringify({label:"suspension status", value:"0", initiator:admin, user:user}))
			}
		})
	}).catch(err => { 
		console.log(err.message) 
		callback(JSON.stringify({error: err}), null)
	})
}

Browse.block = (user, blocker, callback) => {
	var params = ['username', 'blocker']
	var pvals = [user, blocker]
	Q.fetchoneMRows("blocked", ['id'], params, pvals, (err, res) => {
		if (res && res.length > 0) {
			Q.deloneMRows("blocked", params, pvals, (err, res)=> {
				if (err) {
					console.log(err)
					callback(JSON.stringify({error: err}), null)
				}
				else {
					console.log(`${blocker} unblocked ${user}`)
					callback(null, JSON.stringify({ label:"blocked status", value:"0", initiator:blocker, user:user }))
				}
			})
		}
		else
			Q.insert("blocked", params, pvals, (err, res) => {
				if (err) {
					console.log(err)
					callback(JSON.stringify({error: err}), null)
				}
				else {
					console.log(`${blocker} blocked ${user}`)
					callback(null, JSON.stringify({ label:"blocked status", value:"1", initiator:blocker, user:user }))
				}
			})
	})
}

Browse.checkstat = (user, other, table, params, callback) => {
	var pvals = [user, other]
	Q.fetchoneMRows(table, ['id'], params, pvals, (err, res) => {
		if (err) {
			callback(JSON.stringify({error: err}), null)
		}
		else if (res && res.length > 0) {
			callback(null, JSON.stringify({status: "1"}))
		}
		else {
			callback(null, JSON.stringify({status: "0"}))
		}
	})
}

Browse.likeTweaked = (user, liked, callback) => {
	var params = ['username', 'liked']
	var pvals = [user, liked]
	Q.fetchoneMRows("likes", ['id'], params, pvals, (err, res) => {
		if (res && res.length > 0) {
			Q.deloneMRows("likes", params, pvals, (err, result) => {
				if (err)
					callback(JSON.stringify({error: err}), null)
				else { 
					console.log(`${user} unliked ${liked}`)
					Browse.popularity(liked, (err, res) => {
						if (err)
							callback(err)
						console.log(res)
					})
					callback(null, JSON.stringify({ label:"like status", value:"0", initiator:user, user:liked }))
				}
			})
		} else {
			Q.insert("likes", params, pvals, (err, result) => {
				if (err) {
					callback(JSON.stringify({error: err}), null)
				}
				else {
					console.log(`${user} liked ${liked}`)
					Browse.popularity(liked, (err, res) => {
						if (err)
							callback(err)
						console.log(res)
					})
					callback(null, JSON.stringify({ label:"like status", value:"1", initiator:user, user:liked }))
				}
			})
		}
	})
}

Browse.checkMatch = (user, liked, callback) => {
	var params = ['username', 'liked']
	var pvals = [liked, user]
	Q.fetchoneMRows("likes", ['liked', 'lovers'], params, pvals, (err, res) => {
		 if (res && res.length > 0) {
		 	if (res[0].lovers == 1) {
				Q.updateMRows("likes", ['lovers'], 0, params, [user, liked], (err, res) => {
					if (err)
						callback(err)
					else {
						Q.updateMRows("likes", ['lovers'],0, params, pvals, (err, res) => {
							if (err)
								callback(err)
							else
								callback(null, `${user} & ${liked} are not a match :(`)
						})
					}
				})
			} else {
				Q.updateMRows("likes", ['lovers'], 1, params, pvals, (err, success) => {
					if (err)
						callback(err+" mxm", null)
					else {
						Q.updateMRows("likes", ['lovers'], 1, params, [user, liked], (err, success) => {
							Q.fetchoneMRows('notifications', ['sender'], ['sender', 'receiver', 'type'], [user, liked, 'love'], (err, data) => {
								if (data && data.length == 0) {
									Q.insert('notifications', ['sender', 'receiver', 'type'], [user, liked, 'love'], (err, res) => {})
								}
							})
							callback(null, null, `${user} & ${liked} like each other!`)
						})
					}
				})
			}
		}
	})
}

Browse.findLocals = (username, callback) => {
	var gender = 'male'
	var bi = null
	var locals = []
	Q.fetchone('profiles', ['id', 'preference', 'city', 'interests'], 'username', username, (err, profile) => {
		if (profile && profile.length > 0) {
			if (profile[0].preference === 'women')
				gender = 'female'
			else if(profile[0].preference === 'both')
				bi = 'female'
			var interests = profile[0].interests.split(',')
			Q.fetchoneMRowNot('profiles', ['username', 'age', 'gender', 'city', 'interests', 'suspended', 'popularity', 'bio'], ['gender', 'username'], [gender, username], [bi, username], (err, bMatch) => {
				if (bMatch && bMatch.length > 0) {
					var gMatch = []
					var bloc = new Promise ((resolve, reject) => {
						Q.fetchone('blocked', ['username'], 'blocker', username, (err, block) => {
							if (block && block.length > 0)
								resolve(block)
							else
								resolve(null)
						})
					})
					bloc.then(block => {
						var flag = []
						for (let i in block)
							flag.push(block[i].username)
						for (let i in bMatch) {
							if (bMatch[i].suspended === 0 && !flag.includes(bMatch[i].username))
								gMatch.push(bMatch[i])
						}
						for (let i in gMatch) {
							let ptags = gMatch[i].interests.split(',')
							for (let j in ptags) {
								if (interests.includes(ptags[j]) && gMatch[i].city === profile[0].city && gMatch[i].popularity >= 5 && !locals.includes(gMatch[i])) 
									locals.push(gMatch[i])
							}
						}
						for (let i in gMatch) {
							let ptags = gMatch[i].interests.split(',')
							for (let j in ptags) {
								if (interests.includes(ptags[j]) && gMatch[i].city === profile[0].city && !locals.includes(gMatch[i])) 
									locals.push(gMatch[i])
							}
						}
						for (let i in gMatch) {
								if (gMatch[i].city === profile[0].city && gMatch[i].popularity >= 5 && !locals.includes(gMatch[i])) 
									locals.push(gMatch[i])
						}
						for (let i in gMatch) {
								if (gMatch[i].city === profile[0].city && !locals.includes(gMatch[i])) 
									locals.push(gMatch[i])
						}
						for (let i in gMatch) {
							let ptags = gMatch[i].interests.split(',')
							for (let j in ptags) {
								if (interests.includes(ptags[j]) && !locals.includes(gMatch[i])) 
									locals.push(gMatch[i])
							}
						}
						for (let i in gMatch) {
							if (!locals.includes(gMatch[i]))
								locals.push(gMatch[i])
						}
						callback(null, locals)
					})
				} else
					callback('no matches in your area')
			})
		} else
			callback('no preference')
	})
}

Browse.filterResults = (res, sort, callback) => {
	var no = 'no matches found'
	var pure = []
	if (sort.sort === 'age') {
	  S.ageRange(sort.by, (err, exp, range) => {
			if (err)
				callback(err)
			else if (exp) {
				for (let i in res) {
					if (res[i].age === exp)
						pure.push(res[i])
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)
			} else if (range) {
				for (let i in res) {
					if (res[i].age > range[0] && res[i].age < range[1])
						pure.push(res[i])
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)
			}
		})
	} else if (sort.sort === "popularity"){
		S.popRange(sort.by, (err, exp, range) => {
			if (err)
				callback(err)
			else if (exp) {
				for (let i in res) {
					if (res[i].popularity === exp)
						pure.push(res[i])
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)

			} else if (range) {
				for (let i in res) {
					if (res[i].popularity > range[0] && res[i].popularity < range[1])
						pure.push(res[i])
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)
			}
		})
	} else if (sort.sort === "city"){
		S.locate(sort.by, (err, city) => {
			if (err)
				callback(err)
			else {
				for (let i in res) {
					if (res[i].city === city)
						pure.push(res[i])
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)
			}
		})
	} else if (sort.sort === "interests"){
		S.tags(sort.by, (err, range) => {
			if (err)
				callback(err)
			else {
				var interests = sort.by.split(',')
				for (let i in interests) {
					for (let a in res) {
						var data = res[a].interests.split(',')
						if (data.includes(interests[i]) && !pure.includes(res[a]))
							pure.push(res[a])
					}
				}
				if (pure.length > 0)
					callback(null, pure)
				else
					callback(no)
			}
		})
	}
}

Browse.filterNoti = (user, results, callback) => {
	Q.fetchone('blocked', ['username'], 'blocker', user, (err, block) => {
		if (err)
			callback(err)
		else if (block.length > 0) {
			var flag = []
			var clean = []
			for (let i in block)
				flag.push(block[i].username)
			for (let i in results) {
				if (!flag.includes(results[i].sender))
					clean.push(results[i])
			}
			callback(null, clean)
		} else
			callback(null, results)
	})
}

Browse.filterBlock = (user, results, callback) => {
	Q.fetchone('blocked', ['username'], 'blocker', user, (err, block) => {
		if (err)
			callback(err)
		else if (block.length > 0) {
			var flag = []
			var clean = []
			for (let i in block)
				flag.push(block[i].username)
			for (let i in results) {
				if (!flag.includes(results[i].username))
					clean.push(results[i])
			}
			callback(null, clean)
		} else
			callback(null, results)
	})
}

Browse.search = (search, callback) => {
	var pars = ['username', 'gender', 'city', 'interests','bio']
	var no = 'no matches found'
	if (search.filter === 'age') {
	  S.ageRange(search.find, (err, exp, range) => {
			if (err)
				callback(err)
			else if (exp) {
				Q.fetchone('profiles', pars, 'age', exp, (err, profiles) => {
					if (err)
						callback(err)
					else if (profiles.length > 0)
						callback(null, profiles)
					else
						callback(no)
				})
			} else if (range) {
				Q.fetchoneRange('profiles', pars, 'age', range[0], range[1], (err, profiles) => {
				if (err)
					callback(err)
				else
					callback(null, profiles)
				})
			}
		})
	} else if (search.filter === "popularity"){
		S.popRange(search.find, (err, exp, range) => {
			if (err)
				callback(err)
			else if (exp) {
				Q.fetchone('profiles', pars, 'popularity', exp, (err, profiles) => {
					if (err)
						callback(err)
					else if (profiles.length > 0)
						callback(null, profiles)
					else
						callback(no)
				})
			} else if (range) {
				Q.fetchoneRange('profiles', pars, 'popularity', range[0], range[1], (err, profiles) => {
					if (err)
						callback(err)
					else if (profiles.length > 0)
						callback(null, profiles)
					else
						callback(no)
				})
			}
		})
	} else if (search.filter === "city"){
		S.locate(search.find, (err, city) => {
			if (err)
				callback(err)
			Q.fetchone('profiles', pars, 'city', city, (err, profiles) => {
				if (err)
					callback(err)
				else if (profiles.length > 0)
					callback(null, profiles)
				else
					callback(no)
			})
		})
	} else if (search.filter === "interests"){
		S.tags(search.find, (err, range) => {
			if (err)
				callback(err)
			Q.fetchoneMOrRows('interests', ['user_list'], ['interest'], range, (err, list) => {
				if (err)
					callback(err)
				else if (list) {
					var users = []
					for (let a in list) {
						var data = list[a].user_list.split(',')
						for (let i in data) {
							if (!users.includes(data[i]))
								users.push(data[i])
						}
					}
					if (users.length > 0) {
						Q.fetchoneMOrRows('profiles', pars, ['id'], users, (err, profiles) => {
							if (err)
								callback(err)
							else if (profiles.length > 0)
								callback(null, profiles)
							else
								callback(no)
						})
					} else
					callback(no)
				}
			})
		})
	}
}

module.exports = Browse
