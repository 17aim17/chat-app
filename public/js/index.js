const socket = io(); // keep the connection open
//  console.log(socket);
socket.on('connect', function () {
    console.log('connected to Server')
})

socket.on('disconnect', function () {
    console.log('disconnected to Server')
})

socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    })
    jQuery('#messages').append(html)
})


$('#message-form').on('submit', function (e) {
    e.preventDefault()
    const msgTextBox = jQuery('[name=message]')
    socket.emit('createMessage', {
        from: 'Anonymous',
        text: msgTextBox.val()
    }, function () {
        msgTextBox.val('')
    })
})

//  click listener for send location

const locationButton = jQuery('#send-location')

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location..')

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send location')
        alert('Unable to fetch location')
    })
})

socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a')
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formattedTime
    })
    jQuery('#messages').append(html)
})