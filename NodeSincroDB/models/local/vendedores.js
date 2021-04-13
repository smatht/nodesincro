const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Vendedores', {
      idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
      sNombre: Sequelize.STRING,
      sApellido: Sequelize.STRING,
      idPV: {type: Sequelize.INTEGER, field: 'idPv'},
      idSucursal: Sequelize.INTEGER,
      bCambioLista: Sequelize.INTEGER,
      rPorcDescuento: Sequelize.REAL,
      bCambioPrecio: Sequelize.INTEGER,
      bCambiaRuta: Sequelize.INTEGER,
      bPrecioVenta0: Sequelize.INTEGER,
      idDeposito: Sequelize.INTEGER,
      besSupervisor: Sequelize.INTEGER,
      bLimitaaCredito: Sequelize.INTEGER,
      bVendedorMostrador: Sequelize.INTEGER,
      bActivo: Sequelize.INTEGER,
      bPermitePedidoPresupuesto: Sequelize.INTEGER,
      bPermiteConfDesc: Sequelize.INTEGER,
      bPermiteCambioNumeracion: Sequelize.INTEGER,
      iTipoDispositivo: Sequelize.INTEGER,
      bInformaStock: Sequelize.INTEGER,
      bPermiteDescuentocab: Sequelize.INTEGER,
      idVendedorSupervisor: Sequelize.INTEGER,
      bFacturarContadoClienteMoroso: Sequelize.INTEGER,
      bVentaStockNeg: Sequelize.INTEGER,
      iUltPedido: Sequelize.INTEGER,
      iUltRecibo: Sequelize.INTEGER,
      bPermiteVenta: Sequelize.INTEGER,
      bAgruparLimiteSegunTipoImpuesto: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Vendedores'
      })
}