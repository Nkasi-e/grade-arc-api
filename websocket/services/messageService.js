module.exports = {
  create,
  edit,
  remove,
  reply,
  getChatMessages,
}

const db = require('../../_helpers/db')
const { uploadFile } = require('../helpers')

const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')

async function create(data) {
  const { author, messageText, isMessageFile, file, roomName, userId } = data

  const attributes = {
    userId,
    messageText,
    author,
    roomName,
  }

  // check if user sent a file
  if (isMessageFile) {
    // upload if file is present
    attributes.fileUploadName = uploadFile(file)
  }

  return (await db.ChatMessage.create(attributes)).get()
}
async function edit(data) {
  const { messageId, messageText, isMessageFile, file, userId } = data

  const attributes = {
    messageText,
    isMessageEdited: true,
  }

  const options = {
    where: {
      id: messageId,
      userId,
    },
  }

  const message = await db.ChatMessage.findOne(options)
  if (message) {
    if (isMessageFile) {
      fs.fileWriteSync(
        path.join(
          __dirname,
          '../../public/uploads/chat',
          message.fileUploadName,
        ),
        file.raw,
        {
          encoding: 'base64',
        },
      )
    }
    Object.assign(message, attributes)
    await message.save()
    return message.get()
  }
  throw 'Failed to send message'
}
async function remove(data) {
  const { messageId, userId } = data
  const options = {
    attributes: ['id', 'fileUploadName'],
    where: {
      id: messageId,
      userId, // check if user owns the message
    },
  }

  const message = await db.ChatMessage.findOne(options)
  // check if user owns the message
  if (message) {
    // if the message was an uploaded file
    if (message.fileUploadName) {
      fs.unlinkSync(
        path.join(
          __dirname,
          '../../public/uploads/chat/',
          message.fileUploadName,
        ),
      )
    }
  }
  await db.ChatMessage.destroy({
    where: {
      id: messageId,
    },
  })
}
async function reply(data) {
  const {
    isMessageFile,
    file,
    author,
    messageText,
    replyTo,
    roomName,
    userId,
  } = data

  console.log({ replyTo })

  const attributes = {
    messageText,
    author,
    roomName,
    replyTo,
    userId,
  }

  // user sent a file ?
  if (isMessageFile) {
    attributes.fileUploadName = uploadFile(file)
  }
  return (await db.ChatMessage.create(attributes)).get()
}
async function getChatMessages(roomName) {
  const options = {
    order: [['id', 'DESC']],
    limit: 100,
    // raw: true,
  }

  const messagesWithoutReplies = await db.ChatMessage.findAll({
    where: {
      roomName,
      replyTo: {
        [Op.is]: null,
      },
    },
    ...options,
  })

  const messagesWithReplies = await db.ChatMessage.findAll({
    include: { model: db.ChatMessage, as: 'reply', required: true },
    where: { roomName },
    ...options,
  })

  const messages = [...messagesWithReplies, ...messagesWithoutReplies]
    .sort((a, b) => (a.reply.createdAt > b.createdAt ? -1 : 1))
    .reverse()

  return messages
}
