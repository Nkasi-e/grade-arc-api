const { DataTypes } = require('sequelize')

module.exports = model

function model (sequelize) {
  const attributes = {
    action: { type: DataTypes.STRING, allowNull: false }
  }

  const options = {
    underscored: true,
    defaultScope: {
      // exclude hash by default
      attributes: {}
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} }
    }
  }

  return sequelize.define('AuditLog', attributes, options)
}
