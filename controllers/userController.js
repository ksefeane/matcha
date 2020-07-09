const Q = require('../models/queryModel')
const User = require('../models/userModel')
const pass = require('../models/passwordModel')
const gen = require('../models/generateUsersModel')
const admin = require('../models/adminModel')
const key = require('../models/keyGeneratorModel')
const soc = require('../controllers/socketController')
const B = require('../models/browseModel')

exports.auth = (req, res, next) => {
	var token = req.session.token
	var adminToken = req.session.adminToken
	if (!token)
		res.redirect('/login')
	else {
		Q.fetchone("tokens", ['token'], 'token', token, (err, result) => {
			if (err)
				res.redirect('/login')
			else if (result.length > 0) {
				next()
			}
			else
				res.redirect('/login')
		})
	}
}

exports.loginForm = (req, res) => {
	if (req.session.token)
		res.redirect('/logout')
	else
		res.render('login')
}

exports.list_users = (req, res) => {
	var token = req.session.token
	var adminToken = req.session.adminToken
	var user = req.session.user
	var pars = {token: token, adminToken: adminToken, user: user, suggestions: null}
	let findSuggestions = new Promise ((resolve, reject) => {
		B.findLocals(user, (err, locals) => {
			if (err)
				reject(err)
			else
				resolve(locals)
		})
	})
	findSuggestions.then((locals) => {
		pars.suggestions = locals
		res.render('index', pars)
	})
	.catch(e => {
		 pars.e = e
		 console.log(e)
		 res.render('index', pars)
	})
}

exports.suggestions_param = (req, res, next) => {
	if (req.body.find)
		res.redirect(`/search/${req.body.filter}/${req.body.find}`)
	else
		res.redirect('/')
}

exports.filter = (req, res) => {
	var filter = req.body
	var token = req.session.token
	var adminToken = req.session.adminToken
	var user = req.session.user
	var pars = {token: token, adminToken: adminToken, user: user, suggestions: null}
	let payload = new Promise ((resolve, reject) => {
		 if (filter.newfilter) {
		 	var search = {filter: filter.newfilter, find: filter.newfind}
			B.search(search, (err, found) => {
				if (err)
					reject(err)
				else
					resolve(found)
			})
		} else {
			B.findLocals(user, (err, locals) => {
				if (err)
					reject(err)
				else
					resolve(locals)
			})
		}
	})
	payload.then((results) => {
		var sort = {sort: filter.sort, by: filter.by}
		var funnel = new Promise((resolve, reject) => {
			B.filterResults(results, sort, (err, pure) => {
				 if (err)
				 	reject(err)
				 else
					resolve(pure)
			})
		})
		funnel.then((pure) => {
			pars.suggestions = pure
			res.render('index', pars)
		})
		.catch(e => {
		 	pars.e = e
		 	res.render('index', pars)
		})
	})
	.catch(e => {
		 pars.e = e
		 res.render('index', pars)
	})
}

exports.search = (req, res) => {
	var search = req.params
	var token = req.session.token
	var adminToken = req.session.adminToken
	var user = req.session.user
	var pars = {token: token, adminToken: adminToken, user: user, suggestions: null, search: search}
	let searchSuggestions = new Promise ((resolve, reject) => {
		B.search(search, (err, found) => {
			if (err)
				reject(err)
			else {
				B.filterBlock(user, found, (err, clean) => {
					if (err)
						reject(err)
					else
						resolve(clean)
				})
			}
		})
	})
	searchSuggestions.then((found) => {
		pars.suggestions = found
		res.render('search', pars)
	})
	.catch(e => {
		pars.e = e
		res.render('search', pars)
	})
}


exports.formSignup = (req, res) => {
	var i = {username: null, first_name: null, last_name: null, email: null}
	if (req.session.token)
		res.redirect('/logout')
	else
		res.render('signup', {i: i})
}

exports.registerUser = (req, res) => {
	const newUser = new User(req.body)
	User.validate(newUser, (err, result) => {
		if (err) {
			console.log("registration failed", err)
			res.render('signup', {i: newUser, e: err})
		}
		else {
			User.check(newUser, (err, result) => {
				if (err) {
					console.log("registration failed", err)
					res.render('signup', {i: newUser, e: err})
				}
				else {
					User.create(newUser, (err, result) => {
						if (err)
							console.log(err)
						else {
							console.log("registration successful (please check email for verification link)")
							res.render('login', {e: 'registration successful (please check email for verification link)'})
						}
					})
				}
			})
		}
	})
}

exports.loginUser = (req, res, next) => {
	const newUser = new User(req.body)
	/* admin navbar link */
	let promise = new Promise ((resolve, reject) => {
		User.login(newUser, (err, result) => {
			if (err) {
				reject(err)
			}
			else {
				req.session.token = result
				req.session.user = newUser.username
				resolve(req.session.user)
			}
		})
	})	
	promise.then(user => {
		let vetted = new Promise ((y, n) => {
			admin.isAdmin(user, (fail, win) => {
					if (fail) {
						throw(fail)
					}
					else {
						req.session.adminToken = win
						y(req.session.adminToken)
					}
			})
		})
		vetted.then ((status) => {
			let admin = (status === 1) ? "[admin]" : "[non-admin]"
			console.log("login successful ", admin)
			next()
		}).catch(err => { throw(err)})
	}).catch(err => { 
		console.log(err)
		res.render('login', {e: err})
	})
	/* eoc */
}

exports.logoutUser = (req, res, next) => {
	Q.delone("tokens", 'token', req.session.token, (err, result) => {
		if (err)
			console.log(err)
		else {
			var t = new Date()
			Q.update('profiles', ['last_seen'], t.toLocaleString(), 'username', req.session.user, () => {})
			console.log(`${req.session.user} logged out`)
			req.session.reset()
			res.redirect('/login')
		}
	})
}

exports.verifyUser = (req, res) => {
	var token = req.params.token
	User.verify(token, (err, result) => {
		if (err) {
			console.log("verification failed")
			res.redirect('/signup')
		}
		else {
			console.log("user verified")
			res.redirect('/login')
		}
	})
}

exports.createAdmin = (req, res) => {
	gen.initAdmin(req.session.user, (result) => {
			res.send(result)
	})
}

exports.vAdmin =(req, res) => {
	gen.verifyAdmin(req.session.user, req.body.key, (err, result) => {
		if (err) {
			console.log(err)
			res.redirect('/p')
		}
		else {
			let promise = new Promise((resolve, reject) => {
				key.genPlaces(25, (error, success) => {
					if (error) {
						reject(error)
					}
					else {
						console.log(result)
						req.session.adminToken = 1
						resolve(success)
					}
				})
			})
			promise.then(places => {
				console.log(places)
				res.redirect('../admin')
			}).catch(err => { console.log(err) })
			//res.send(result)
		}
	})
}
