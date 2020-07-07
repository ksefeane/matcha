var sender = io('/'+$('#user').val())
var receiver = io('/'+$('#receiver').val())

sender.emit('visited', {s: $('#user').val(), r: $('#receiver').val()})
receiver.emit('visited', {s: $('#user').val(), r: $('#receiver').val()})
