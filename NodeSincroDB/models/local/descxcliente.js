const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DescXCliente', {
      idDescuento: { type: Sequelize.INTEGER, primaryKey: true },
      id: Sequelize.INTEGER,
      idCliente: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'DescXCliente'
      })
}