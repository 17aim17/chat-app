exports.generateMessage = (text) => {
    return {
        text: text,
        createdAt: new Date().getTime()
    }
}
exports.generateLocationMessage = (data) => {
    return {
        url: `https://google.com/maps?q=${data.lat},${data.long}`,
        createdAt: new Date().getTime()
    }
}