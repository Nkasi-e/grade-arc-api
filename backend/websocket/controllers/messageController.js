module.exports = {
  messageCreate,
  messageEdit,
  messageDelete,
  messageReply,
}

const dayjs = require('dayjs')
const { create, edit, remove, reply } = require('../services/messageService')

const { getUserFullName } = require('../helpers')
// Protection against malicious user input. Say client connects to us and purposely sends no arguments to for some event.
const {
  createMessageSchema,
  editMessageSchema,
  deleteMessageSchema,
  replyMessageSchema,
} = require('../validation/schemas')

const { Parents } = require('../../_middleware/role')

async function messageCreate(io, socket, data) {
  // Parents can only view messages
  if (socket.user.role === Parents) {
    return
  }

  const { error } = createMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  const { roomName } = data
  const author = getUserFullName(socket.user)

  create({ ...data, author, userId: socket.user.id })
    .then((message) => {
      // emit to all sockets in "roomName"
      io.to(roomName).emit('message:sent', {
        message: {
          ...message,
          createdAt: dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error: 'Failed to send message',
      })
    })
}
async function messageEdit(io, socket, data) {
  // Parents can only view messages
  if (socket.user.role === Parents) {
    return
  }

  const { roomName } = data

  const { error } = editMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }

  edit({ ...data, userId: socket.user.id })
    .then((message) => {
      // emit to all socket in "roomName"
      io.to(roomName).emit('message:edited', { message })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error,
      })
    })
}
async function messageDelete(io, socket, data = {}) {
  // Parents can only view messages
  if (socket.user.role === Parents) {
    return
  }

  const { roomName, messageId } = data

  const { error } = deleteMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  remove({ ...data, userId: socket.user.id })
    .then(() => {
      io.to(roomName).emit('message:deleted', {
        messageId,
      })
    })
    .catch((error) => {
      console.log({ error })
      socket.emit('message:failed', {
        error,
      })
    })
}
async function messageReply(io, socket, data = {}) {
  // Parents can only view messages
  if (socket.user.role === Parents) {
    return
  }

  const { roomName } = data

  const { error } = replyMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  const author = getUserFullName(socket.user)

  reply({ ...data, author, userId: socket.user.id })
    .then((message) => {
      // emit to all sockets in "roomName"
      console.log({ message })
      io.to(roomName).emit('message:replied', {
        message: {
          ...message,
          createdAt: dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error,
      })
    })
}
