const { DataTypes } = require('sequelize')
const Role = require('../_middleware/role')

module.exports = model

function model(sequelize) {
  const attributes = {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM([...Object.values(Role)]),
      allowNull: false,
      defaultValue: Role.Student,
    },
    // roomName: {type: DataTypes.STRING, allowNull: true}
  }

  const options = {
    underscored: true,
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ['password'] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
      withOutRoles: { attributes: { exclude: ['password', 'role'] } },
    },
  }

  return sequelize.define('User', attributes, options)
}
