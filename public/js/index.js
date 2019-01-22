const socket = io(); // keep the connection open
//  console.log(socket);
socket.on('connect', function () {
    console.log('connected to Server')
    // socket.emit('createMessage', {
    //     form:'Ashish',
    //     text:'hey , this is ashish'
    // })
})
socket.on('disconnect', function () {
    console.log('disconnected to Server')
})

socket.on('newMessage', function (data) {
    console.log('New Message', data)
})