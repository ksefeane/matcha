var socket = io('/'+$('#user').val())
var chat = io('/'+$('#receiver').val())

$('form').submit(function(e){
	e.preventDefault()
	socket.emit('noti', {s: $('#user').val(), r:$('#receiver').val()})
	socket.emit('chat message', {s: $('#user').val(), r: $('#receiver').val(), msg: $('#m').val()})
	chat.emit('chat message', {s: $('#user').val(), r: $('#receiver').val(), msg: $('#m').val()})
	chat.emit('noti', {s: $('#user').val(), r:$('#receiver').val()})
	$('#m').val('')
	return false
})

socket.on('chat message', function({s, r, msg}){
	$('#messages').append($('<small class="text-warning">').text(`${s} `), $('<h6 class="text-light">').text(msg))
	window.scrollTo(0, document.body.scrollHeight)
})
window.scrollTo(0, document.body.scrollHeight)
