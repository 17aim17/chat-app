const express = require('express')
const path = require('path')
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');


const app = express()
const server = http.createServer(app)
//  configuring socket to work with http
const io = socketio(server)
const PORT = process.env.PORT || 3000

const { generateMessage, generateLocationMessage } = require('./utils/message')

app.use(express.static(path.join(__dirname, 'public')))



io.on('connection', (socket) => {
    // console.log('new web socket connections');
    // .on() for getting data and .emit for sending data
    // count example 
    // socket.emit('countUpdated', count);
    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count);  // emits to every single connections including himself
    // });

    socket.emit('newMessage', generateMessage('Welcome bitch!!'));

    socket.broadcast.emit('newMessage', generateMessage('A new User has Joined'));

    socket.on('sendMessage', (data, cb) => {
        const filter = new Filter();
        if (filter.isProfane(data)) {
            return cb('Sorry!, You can not use bad words');
        }
        io.emit('newMessage', generateMessage(data))
        cb()
    })

    // location getting
    socket.on('sendLocation', (data, cb) => {
        io.emit('newLocationMessage', generateLocationMessage(data))
        cb();
    })
    // disconnection-- built in event name
    socket.on('disconnect', () => {
        io.emit('newMessage', generateMessage('A User has left.'))
    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})