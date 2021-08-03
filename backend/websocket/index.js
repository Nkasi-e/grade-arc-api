const {
  messageCreate,
  messageEdit,
  messageDelete,
  messageReply,
} = require('./controllers/messageController')

const { joinRoom } = require('./controllers/roomController')

module.exports = (io) => {
  io.on('connect', (socket) => {
    socket.on('message:send', messageCreate.bind(null, io, socket))

    socket.on('message:reply', messageReply.bind(null, io, socket))

    socket.on('message:edit', messageEdit.bind(null, io, socket))

    socket.on('message:delete', messageDelete.bind(null, io, socket))

    socket.on('room:join', joinRoom.bind(null, socket))
  })
}
