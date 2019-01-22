const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')
const moment = require('moment')

const app = express()
const PORT = process.env.PORT || 3000
const publicPath = path.join(__dirname, '..', 'public')
const {generateMessage ,generateLocationMessage} = require('./utils/message')
const server = http.createServer(app)

const io = socketIO(server) //configuring http to use socket io

app.use(express.static(publicPath))

io.on('connection', (socket) => { // same as public
    console.log('New User Connected');
    // greeting a new user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to The Chat'))

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))

    socket.on('createMessage', (message ,callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback();
    })

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin' ,coords.latitude , coords.longitude) )
    })

    socket.on('disconnect', (socket) => { // same as public
        console.log('cllient disconnected');
    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})