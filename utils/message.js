exports.generateMessage = ({ data, username }) => {
    return {
        text: data,
        username: username,
        createdAt: new Date().getTime()
    }
}
exports.generateLocationMessage = ({ data, username }) => {
    return {
        url: `https://google.com/maps?q=${data.lat},${data.long}`,
        username: username,
        createdAt: new Date().getTime()
    }
}