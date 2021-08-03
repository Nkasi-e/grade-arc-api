module.exports = { getChatData }

const db = require('../../_helpers/db')
const { Op } = require('sequelize')
const { getAllInClass } = require('../../services/userService')

async function getChatData(roomName, classId) {
  const messages = await getChatMessages(roomName)
  const usersInClass = await getAllInClass(classId)
  return {
    messages,
    usersInClass,
  }
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
    .sort((a, b) => (a.reply?.createdAt > b.createdAt ? -1 : 1))
    .reverse()

  return messages
}
