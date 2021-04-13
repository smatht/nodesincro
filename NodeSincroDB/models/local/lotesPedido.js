const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('LotesPedido', {
      idLotePedido: { type: Sequelize.INTEGER, primaryKey: true },
      idSucursal: Sequelize.INTEGER,
      sObservaciones: Sequelize.STRING,
      fLotePedido: Sequelize.DATE,
      idVendedor: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'LotesPedido'
      })
}