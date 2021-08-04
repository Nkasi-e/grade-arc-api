const { DataTypes } = require('sequelize')
const db = require('../_helpers/db')
module.exports = model

function model(sequelize) {
  const attributes = {
    author: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    roomName: { type: DataTypes.STRING, allowNull: false },
    messageText: { type: DataTypes.STRING, allowNull: true },
    fileUploadName: { type: DataTypes.STRING, allowNull: true },
    isMessageEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isReplyToDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  }

  const options = {
    underscored: true,
    updatedAt: false,
    hooks: {
      beforeBulkDestroy: async (chatMessage) => {
        console.log('beforeBulkDestroy-------------------------------')
        await db.ChatMessage.update(
          {
            isReplyToDeleted: true,
          },
          {
            where: {
              replyTo: chatMessage.where.id,
            },
          },
        )
      },
      beforeDestroy: async (chatMessage) => {
        console.log('beforeDestroy-----------------------------------')
        await db.ChatMessage.update(
          {
            isReplyToDeleted: true,
          },
          {
            where: {
              replyTo: chatMessage.where.id,
            },
          },
        )
      },
    },
  }

  return sequelize.define('chatMessage', attributes, options)
}
