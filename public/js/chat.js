var socket = io('/'+$('#user').val())
var chat = io('/'+$('#receiver').val())

$('form').submit(function(e){
	e.preventDefault()
	socket.emit('chat message', {s: $('#user').val(), r: $('#receiver').val(), msg: $('#m').val()})
	chat.emit('chat message', {s: $('#user').val(), r: $('#receiver').val(), msg: $('#m').val()})
	socket.emit('noti', {s: $('#user').val(), r:$('#receiver').val()})
	chat.emit('noti', {s: $('#user').val(), r:$('#receiver').val()})
	$('#m').val('')
	return false
})

socket.on('chat message', function({s, r, msg}){
	$('#messages').append($('<small>').text(`${s} `), $('<p>').text(msg))
	window.scrollTo(0, document.body.scrollHeight)
})
window.scrollTo(0, document.body.scrollHeight)
