const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('PedidosItems', {
      idNumLinea: { type: Sequelize.INTEGER, primaryKey: true },
      idPedido: { type: Sequelize.INTEGER, primaryKey: true },
      idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
      iOrigen: { type: Sequelize.INTEGER, primaryKey: true },
      iCantidad: Sequelize.REAL,
      rPrecio: Sequelize.REAL,
      idDeposito: Sequelize.INTEGER,
      idLote: Sequelize.INTEGER,
      idLista: Sequelize.INTEGER,
      idProducto: Sequelize.INTEGER,
      idUnidad: Sequelize.INTEGER,
      bFacturado: { type: Sequelize.SMALLINT, defaultValue: 0 },
      bPendiente: { type: Sequelize.SMALLINT, defaultValue: 1 },
      bSinLote: Sequelize.SMALLINT,
      iCantSub: { type: Sequelize.REAL, defaultValue: 0 },
      rDescuento: Sequelize.REAL,
      rTotBruto: Sequelize.REAL,
      rAlicuota: Sequelize.REAL,
      rComisionAPagar: Sequelize.REAL,
      rPrecioListaConImpuestos: Sequelize.REAL,
      iCantUMxUnidad: { type: Sequelize.REAL, defaultValue: 1 },
      cCostoUni: Sequelize.REAL,
      sObservItem: Sequelize.STRING,
      rPrecioOrig: Sequelize.REAL,
      idContenedor: Sequelize.INTEGER,
      rImpuesto: Sequelize.REAL,
      cPrecioConImp: Sequelize.REAL,
      rTotNeto: Sequelize.REAL,
      id: Sequelize.UUID
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'PedidosItems',
        hasTrigger: true
      })
}