const socket = io(); // keep the connection open
//  console.log(socket);
socket.on('connect', function () {
    console.log('connected to Server')
})

socket.on('disconnect', function () {
    console.log('disconnected to Server')
})

socket.on('newMessage', function (message) {
    console.log('New Message', message)
    const li = jQuery('<li></li>');
    li.text(`${message.from} :  ${message.text}`)

    jQuery('#messages').append(li)
})


$('#message-form').on('submit', function (e) {
    e.preventDefault()

    socket.emit('createMessage', {
        from: 'Anonymous',
        text: $('[name=message]').val()
    }, function (msg) {
        console.log('got the message', msg);
    })
})