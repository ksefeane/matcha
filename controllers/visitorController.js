const Q = require('../models/queryModel')
const B = require('../models/browseModel')

exports.listVisitors = (req, res) => {
	var token = req.session.token
	var adminToken = req.session.adminToken
	var visitors = null
	var notifications = null
	var user = req.session.user
	Q.fetchone("visits", ['visitor'], ['visited'], [user], (err, data) => {
		if (err)
			console.log(err)
		else if (data.length > 0) 
			visitors = data
		Q.fetchoneMRows('notifications', ['sender'], ['receiver', 'type'], [user, 'visit'], (err, notis) => {
			if (err)
				console.log(err)
			else if (notis.length > 0) 
				notifications = notis
			res.render('visitors', {
				token: token, 
				visitors: visitors,
				adminToken: adminToken,
				user: user,
				notifications: notifications
			})
		})
	})
}

exports.listLikes = (req, res) => {
	var token = req.session.token
	var adminToken = req.session.adminToken
	var likes = null
	Q.fetchone("likes", ['username'], 'liked', req.session.user, (err, data) => {
		if (err)
			console.log(err)
		else if (data.length > 0) {
			likes = data
		} else {console.log('no one likes you')}
		Q.deloneMRows('notifications', ['receiver', 'type'], [req.session.user, 'like'], () => {console.log(`${req.session.user} notifications reset [likes]`)})
		res.render('likes', {
			token: token, 
			likes: likes,
			adminToken: adminToken,
			user: req.session.user
		})
	})
}

exports.notifications = (req, res) => {
	var user = req.session.user
	var token = req.session.token
	var adminToken = req.session.adminToken
	var chats = null
	var matches = null
	var likes = null
	var visits = null
	let promise = new Promise ((resolve) => {
		Q.deloneMRows('notifications', ['receiver', 'type'], [user, 'visit'], () => {})
		Q.fetchoneMAndOr4('notifications', ['sender', 'type'], ['receiver', 'type'], [user, 'chat'], [user, 'like'], [user, 'visit'], [user, 'love'], (err, notis) => {
			B.filterNoti(user, notis, (err, clean) => {
				if (err)
					console.log(err)
				else {
					var n = {c: [], m: [], v: [], l: []}
					for (let i in clean) {
						if (notis[i].type === 'chat')
							n.c = [...n.c, clean[i].sender]
						else if (notis[i].type === 'like')
							n.l = [...n.l, clean[i].sender]
						else if (notis[i].type === 'love')
							n.m = [...n.m, clean[i].sender]
						else if (notis[i].type === 'visit')
							n.v = [...n.v, clean[i].sender]
					}
					resolve(n)
				}
			})
		})
	})
	promise.then(n => {
		res.render('notifications', {
			token: token,
			chats: n.c,
			likes: n.l,
			visits: n.v,
			matches: n.m,
			adminToken: adminToken,
			user: user,
		})
	})
}

exports.lost = (req, res, next) => {
	var m = req.params.map
	if (m == 'visitors')
		next()
	else
		res.send('lost')
}
