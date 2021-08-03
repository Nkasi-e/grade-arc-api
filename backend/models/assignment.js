const { DataTypes } = require('sequelize')
const Role = require('../_middleware/role');

module.exports = model

function model (sequelize) {
    const attributes = {
        question: { type: DataTypes.TEXT, allowNull: false },
        dueDate: { type: DataTypes.DATE, allowNull: false },
        fileSubmission: { type: DataTypes.BOOLEAN, allowNull: false },
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

    return sequelize.define('Assignment', attributes, options)
}
