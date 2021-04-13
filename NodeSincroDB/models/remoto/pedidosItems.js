const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PedidosItems', {
      id: {type: Sequelize.UUID, primaryKey: true},
      idEmpresa: Sequelize.INTEGER,
      idPedido: Sequelize.INTEGER,
      idVendedor: Sequelize.INTEGER,
      idLinea: Sequelize.INTEGER,
      nCantidad: Sequelize.REAL,
      fPrecio: Sequelize.REAL,
      idDeposito: Sequelize.INTEGER,
      idLote: Sequelize.INTEGER,
      idLista: Sequelize.INTEGER,
      idProducto: Sequelize.INTEGER,
      idUnidad: Sequelize.INTEGER,
      rSubDescuento: Sequelize.REAL,
      rSubImpuesto: Sequelize.REAL,
      iCantUMxUnidad: Sequelize.INTEGER,
      rPrecioOrig: Sequelize.REAL,
      cCostoUni: Sequelize.REAL,
      idCliente: Sequelize.INTEGER,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE,
      PedidoID: Sequelize.UUID
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'PedidosItems',
        hasTrigger: true
      })
}