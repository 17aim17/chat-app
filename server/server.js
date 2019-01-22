const path = require('path')
const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const PORT = process.env.PORT || 3000
const publicPath = path.join(__dirname, '..', 'public')
const {generateMessage} = require('./utils/message')
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
        callback('This is From server');
        //broadcasting
        // socket.broadcast.emit('newMessage', {
        //         from: message.form,
        //         text: message.text,
        //         createdAt:new Date().getTime()
        // })
    })

    socket.on('disconnect', (socket) => { // same as public
        console.log('cllient disconnected');
    })
})

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})