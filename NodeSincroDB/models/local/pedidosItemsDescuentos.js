const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PedidosItemsDescuentos', {
      idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
      iOrigen: { type: Sequelize.INTEGER, primaryKey: true },
      idPedido: { type: Sequelize.INTEGER, primaryKey: true },
      idNumLinea: { type: Sequelize.INTEGER, primaryKey: true },
      idDescuento: { type: Sequelize.INTEGER, primaryKey: true },
      rValorDescuento: Sequelize.REAL,
      rMonto: Sequelize.REAL,
      id: Sequelize.UUID,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'PedidosItemsDescuentos',
        hasTrigger: true
      })
}