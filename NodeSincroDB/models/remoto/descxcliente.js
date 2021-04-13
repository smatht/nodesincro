const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DescXCliente', {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      idDescuento: Sequelize.INTEGER,
      idCliente: Sequelize.INTEGER,
      idEmpresa: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'DescXCliente'
      })
}