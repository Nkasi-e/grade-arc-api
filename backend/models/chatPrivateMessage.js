const { DataTypes } = require('sequelize')
module.exports = model

function model(sequelize) {
  const attributes = {
    isMessageFile: { type: DataTypes.INTEGER, allowNull: true },
    messageText: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    isMessageEdited: { type: DataTypes.INTEGER, allowNull: true },
    roomName: { type: DataTypes.STRING, allowNull: false },
    sender_id: { type: DataTypes.STRING, allowNull: false },
    receiver_id: { type: DataTypes.STRING, allowNull: false },
  }

  const options = {
    underscored: true,
  }

  return sequelize.define('chatPrivateMessage', attributes, options)
}
