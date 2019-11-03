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

const { addUser, getUser, removeUser, getUserInRoom } = require('./utils/user.js')
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

    // socket.emit
    // io.emit
    // socket.broadcast.emit
    // in rooms
    // io.to('room').emit  send to all in specific room
    // socket.boradcast.to('room).emit sending to all in specific room excluding client

    // socket.emit('newMessage', generateMessage('Welcome bitch!!'));

    // socket.broadcast.emit('newMessage', generateMessage('A new User has Joined'));



    // listening for join events
    socket.on('join', (options, cb) => {
        // only used on server
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return cb(error)
        }


        socket.join(user.room)

        socket.emit('newMessage', generateMessage({ data: `Welcome ${user.username}!`, username: 'Admin' }));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        socket.broadcast.to(user.room).emit('newMessage', generateMessage({ data: `${user.username} has Joined`, username: 'Admin' }));

        cb()
    })

    socket.on('sendMessage', (data, cb) => {
        const user = getUser(socket.id);
        if (!user) {
            return cb('Something went wrong!');
        }
        const filter = new Filter();
        if (filter.isProfane(data)) {
            return cb('Sorry!, You can not use bad words');
        }
        io.to(user.room).emit('newMessage', generateMessage({ data, username: user.username }))
        cb()
    })

    // location getting
    socket.on('sendLocation', (data, cb) => {
        const user = getUser(socket.id);
        if (!user) {
            return cb('Something went wrong!');
        }
        io.to(user.room).emit('newLocationMessage', generateLocationMessage({ data, username: user.username }))
        cb();
    })
    // disconnection-- built in event name
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('newMessage', generateMessage({ data: `${user.username} left!`, username: user.username }))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }

    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})