const Sequelize = require('sequelize')
const instance = require('../../database')

const columns = {
    company: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.ENUM('petFood', 'petToys'),
        allowNull: false
    }

}

const tableOptions = {
    freezeTableName: true,
    tableName: 'providers',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    version: 'version'

}

module.exports = instance.define('providers', columns, tableOptions)