const Q = require('../models/queryModel')
const S = require('../models/socketModel')

exports.open = (req, res, next) => {
	var user = req.session.user
   const io = req.app.get('socket')
	const nsp = io.of(`/${user}`)
	var soc = []
   
   nsp.on('connection', socket => {
   	soc.push(socket.id)
   	if (soc[0] === socket.id)
   		console.log(`socket open [${user} -> ${socket.id}]`)
		socket.on('visited', ({s, r}) => {
			S.logVisit(user, s, r, (report) => {console.log(report)})
			S.notifications(user, (logs) => {
				if (logs)
					nsp.emit('notifications', {chats: logs.c, visits: logs.v, likes: logs.l})
			})
		})
		socket.on('liked', ({s, r}) => {
			S.logLike(user, s, r, (report) => {console.log(report)})
			S.notifications(user, (logs) => {
				if (logs)
					nsp.emit('notifications', {chats: logs.c, visits: logs.v, likes: logs.l})
			})
		})
		socket.on('noti', ({s, r}) => {
			S.logNoti(user, s, r, (report) => {console.log(report)})
			S.notifications(user, (logs) => {
				if (logs)
					nsp.emit('notifications', {chats: logs.c, visits: logs.v, likes: logs.l})
			})
		})
		socket.on('refresh', () => {
		S.notifications(user, (logs) => {
				if (logs)
					nsp.emit('notifications', {chats: logs.c, visits: logs.v, likes: logs.l})
			})
		})
		socket.on('chat message', ({s, r, msg}) => {
			nsp.emit('chat message', {s, r, msg})
			S.logChat(user, s, r, msg, (report) => {console.log(report)})
		})
		socket.on('close', () => {
			socket.disconnect(true)
			nsp.removeAllListeners('connection')
   		console.log(`socket closed [${user} -> ${socket.id}]`)
		})
	})
	res.redirect('/notifications')
}
