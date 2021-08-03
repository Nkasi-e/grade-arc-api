const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize) {
  const attributes = {
    taskName: { type: DataTypes.STRING, allowNull: false },
    isFileRequired: { type: DataTypes.BOOLEAN, allowNull: true },
    isTaskFinished: { type: DataTypes.BOOLEAN, allowNull: true },
    uploadFile: { type: DataTypes.STRING, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: false },
  }

  const options = {
    underscored: true,
  }

  return sequelize.define('Tasks', attributes, options)
}
