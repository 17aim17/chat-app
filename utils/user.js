const users = [];

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validation
    if (!(username || room)) {
        return {
            error: 'Username and Room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validating username
    if (existingUser) {
        return {
            error: 'Username is already is in use!'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id == id
    })
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const foundUser = users.find((user) => {
        return user.id === id
    })

    return foundUser;
}

const getUserInRoom = (room) => {
    const usersInRoom = []
    room = room.trim().toLowerCase();
    users.forEach((user) => {
        if (user.room == room) {
            usersInRoom.push(user)
        }
    })

    return usersInRoom
}

module.exports = {
    addUser, getUser, removeUser, getUserInRoom
}