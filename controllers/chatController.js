const Q = require('../models/queryModel')

exports.messages = (req, res) => {
	var user = req.session.user
	var token = req.session.token
	var adminToken = req.session.adminToken
	var lovers = null
	Q.fetchoneMRows("likes", ['liked'], ['username', 'lovers'], [user, 1], (err, data) => {
		if (err)
			console.log(err)
		else if (data.length > 0)
			lovers = data
		res.render('lovers', {
			token: token, 
			adminToken: adminToken,
			user: req.session.user,
			lovers: lovers
		})
	})
}

exports.auth = (req, res, next) => {
	Q.fetchoneMRows("likes", ['username', 'liked'], ['username', 'liked', 'lovers'], [req.session.user, req.params.match, 1], (err, data) => {
  		if (err)
  			console.log(err)
  		else if (data.length > 0)
  			next()
  		else
  			res.redirect(`/p/${req.params.match}`)
	})
}

exports.chat = (req, res) => {
	var token = req.session.token
	var user = req.session.user
	var receiver = req.params.match
	var adminToken = req.session.adminToken
	var messages = null
	Q.deloneMRows('notifications', ['sender', 'receiver', 'type'], [receiver, user, 'chat'], () => {})
	Q.deloneMRows('notifications', ['sender', 'receiver', 'type'], [receiver, user, 'love'], () => {})
	Q.fetchoneMAndOr('chats', ['sender', 'message'], ['sender', 'receiver'], [user, receiver], [receiver, user], (err, data) => {
		if (err)
			console.log(err)
		else if (data.length > 0) {
			messages = data
		} else
			console.log('no messages')
		res.render('chat', {
			token: token, 
			adminToken: adminToken,
			user: user,
			receiver: receiver,
			chats: messages
		})
	})
}
