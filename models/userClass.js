const { DataTypes } = require('sequelize')
const Role = require('../_middleware/role');

module.exports = model

function model (sequelize) {
    const attributes = {}

    const options = {
        underscored: true,
    }

    return sequelize.define('UserClass', attributes, options)
}
