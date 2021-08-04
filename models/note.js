const { DataTypes } = require('sequelize')
module.exports = model

function model(sequelize) {
  const attributes = {
    noteName: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    sharedNote: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  }

  const options = {
    underscored: true,
  }

  return sequelize.define('note', attributes, options)
}
