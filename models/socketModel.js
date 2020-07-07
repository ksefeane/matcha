const Q = require('./queryModel')
const B = require('./browseModel')

exports.logChat = (user, sender, receiver, msg, callback) => {
	if (user === sender) {
		Q.insert('chats', ['sender', 'receiver', 'message'], [sender, receiver, msg], (err, res) => {
  				callback(`${sender} sent a message to ${receiver}`)
		})	 
	} else if (user === receiver)
		callback(`${user} received a message from ${sender}`)
}

exports.logVisit = (user, sender, receiver, callback) => {
	if (user === sender) {
		Q.fetchoneMRows('notifications', ['sender'], ['sender', 'receiver', 'type'], [sender, receiver, 'visit'], (err, data) => {
			if (data && data.length > 0)
				callback(`${sender} sent another notification to ${receiver} [visit]`)
			else {
				Q.insert('notifications', ['sender', 'receiver', 'type'], [sender, receiver, 'visit'], (err, res) => {
					callback(`${sender} sent a notification to ${receiver} [visit]`)
				})
			}
		})
	} else if (user === receiver)
		callback(`${user} received a notification from ${sender} [visit]`)
}

exports.logNoti = (user, sender, receiver, callback) => {
	if (user === sender) {
		Q.fetchoneMRows('notifications', ['sender'], ['sender', 'receiver', 'type'], [sender, receiver, 'chat'], (err, data) => {
			if (data && data.length > 0) 
				callback(`${sender} sent another notification to ${receiver} [message]`)
			else {
				Q.insert('notifications', ['sender', 'receiver', 'type'], [sender, receiver, 'chat'], (err, res) => {
					callback(`${sender} sent a notification to ${receiver} [message]`)
				})
			}
		})
	} else if (user === receiver)
		callback(`${user} received a notification from ${sender} [message]`)
}

exports.logLike = (user, sender, receiver, callback) => {
	if (user === sender) {
		Q.fetchoneMRows('notifications', ['sender'], ['sender', 'receiver', 'type'], [sender, receiver, 'like'], (err, data) => {
			if (data && data.length > 0) 
				callback(`${sender} sent a notification to ${receiver} [like]`)
			else {
				Q.insert('notifications', ['sender', 'receiver', 'type'], [sender, receiver, 'like'], (err, res) => {
					callback(`${sender} sent a notification to ${receiver} [like]`)
				})
			}
		})
	} else if (user === receiver)
		callback(`${user} received a notification from ${sender} [like]`)
}

exports.notifications = (user, callback) => {
	Q.fetchone('notifications', ['sender', 'type'], 'receiver', user, (err, res) => {
		if (err)
			console.log(err)
		else if (res.length > 0) {
			let promise = new Promise ((resolve, reject) => {
				B.filterNoti(user, res, (err, clean) => {
					if (err)
						console.log(err)
					else {
						var n = {c: 0, v: 0, l: 0}
						for (let i in clean) {
							if (clean[i].type === 'chat')
								n.c++
							else if (clean[i].type === 'visit')
								n.v++
							else if (clean[i].type === 'like')
								n.l++
						}
						resolve(n)
					}
				})
			})
			promise.then(n => {callback(n)})
		}
	})
}
