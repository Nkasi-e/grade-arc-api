const { DataTypes } = require('sequelize')
module.exports = model

function model(sequelize) {
  const attributes = {
    folderName: { type: DataTypes.STRING, allowNull: false },
  }

  const options = {
    underscored: true,
  }

  return sequelize.define('noteFolder', attributes, options)
}
