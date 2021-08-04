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

async function messageCreate(io, socket, data = {}) {
  // // only students and teachers can send messages
  // if (socket.user.role === Parents) {
  //   return
  // }

  const { isMessageFile, roomName } = data
  const { error } = createMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  const author = getUserFullName(socket.user)

  create({ ...data, author, userId: socket.user.id })
    .then((message) => {
      // emit to all sockets in "roomName"
      io.to(roomName).emit('message:sent', {
        author,
        messageText: message.messageText,
        messageId: message.id,
        isMessageFile,
        time: dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error: 'Failed to send message',
      })
    })
}
async function messageEdit(io, socket, data = {}) {
  // only students and teachers can edit messages
  if (socket.user.role === Parents) {
    return
  }

  const { messageId, roomName } = data

  const { error } = editMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }

  edit({ ...data, userId: socket.user.id })
    .then((result) => {
      const messageText = result[1]
      // emit to all socket in "roomName"
      io.to(roomName).emit('message:edited', {
        messageText,
        messageId,
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error: 'Failed to send message',
      })
    })
}
async function messageDelete(io, socket, data = {}) {
  // only students and teachers can delete messages
  if (socket.user.role === Parents) {
    return
  }

  const { roomName, messageId, parentId } = data

  const { error } = deleteMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  remove({ ...data, userId: socket.user.id })
    .then((result) => {
      const hadReplies = result[1]
      // emit to all socket in "roomName"
      io.to(roomName).emit('message:deleted', {
        messageId,
        hadReplies,
        parentId,
      })
    })
    .catch((error) => {
      console.log(error)
      socket.emit('message:failed', {
        error: 'Failed to send message',
      })
    })
}
async function messageReply(io, socket, data = {}) {
  // only students and teachers can reply to messages
  if (socket.user.role === Parents) {
    return
  }

  const { isMessageFile, parentId, roomName } = data

  const { error } = replyMessageSchema.validate(data)

  if (error) {
    return socket.emit('message:failed', { error })
  }
  const author = getUserFullName(socket.user)

  reply({ ...data, author })
    .then((message) => {
      // emit to all sockets in "roomName"
      io.to(roomName).emit('message:replied', {
        author,
        messageText: message.messageText,
        messageId: message.id,
        parentId,
        isMessageFile,
        time: dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      })
    })
    .catch((error) => {
      console.log(error)
      // failed to upload file
      socket.emit('message:failed', {
        error: 'Failed to send message',
      })
    })
}
