const { DataTypes } = require('sequelize')
const Role = require('../_middleware/role');

module.exports = model

function model (sequelize) {
    const attributes = {
        courseName: { type: DataTypes.STRING, allowNull: false },
    }

    const options = {
        underscored: true,
        defaultScope: {
            // exclude hash by default
            attributes: { }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {} },
        }
    }

    return sequelize.define('Course', attributes, options)
}
