var visit = document.getElementsByClassName("visited")
var liked = document.getElementsByClassName("liked")
var chat = document.getElementsByClassName("notif")
var notis = document.getElementsByClassName("notifications")
var soc = io('/'+$('#user').val())

soc.emit('refresh')

soc.on('notifications', function({chats, visits, likes}){
	var sum = chats+visits+likes
	if (sum > 0)
		notis[0].innerHTML = `<sup style="color:red">${sum}</sup>`
})
$(document).on("click", "#logout", function(){
	soc.emit('close')
})
