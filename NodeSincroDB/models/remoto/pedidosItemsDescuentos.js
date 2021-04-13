const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PedidosItemsDescuentos', {
      id: { type: Sequelize.UUID, primaryKey: true },
      idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
      idPedido: { type: Sequelize.INTEGER, primaryKey: true },
      idLinea: { type: Sequelize.INTEGER, primaryKey: true },
      idDescuento: { type: Sequelize.INTEGER, primaryKey: true },
      rValorDescuento: Sequelize.REAL,
      rMonto: Sequelize.REAL,
      idCliente: Sequelize.INTEGER,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE,
      PedidoID: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'PedidosItemsDescuentos',
        hasTrigger: true
      })
}