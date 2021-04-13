const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pedidos', {
        idPedido: { type: Sequelize.INTEGER, primaryKey: true },
        idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
        iOrigen: { type: Sequelize.INTEGER, primaryKey: true },
        id: Sequelize.UUID,
        idCliente: Sequelize.INTEGER,
        sObserv: Sequelize.STRING,
        sComentario: Sequelize.STRING,
        sOperador: { type: Sequelize.STRING, defaultValue: 'NODESINCRO' },
        fPedido: Sequelize.DATE,
        fEntrega: Sequelize.DATE,
        idCondVenta: Sequelize.STRING,
        idCondPago: Sequelize.STRING,
        idPV: { type: Sequelize.INTEGER, field: 'idPv' },
        idSucursal: { type: Sequelize.INTEGER, field: 'idSucursal' },
        idMoneda: Sequelize.INTEGER,
        rTotDescuentos: Sequelize.REAL,
        rTotBruto: Sequelize.REAL,
        rTotImpuestos: Sequelize.REAL,
        rTotNeto: Sequelize.REAL,
        iTipoPedido: Sequelize.SMALLINT,
        bRemitado: { type: Sequelize.SMALLINT, defaultValue: 0 },
        // bAfectaStock: { type: Sequelize.INTEGER, defaultValue: 1 },
        InsertedOn: Sequelize.DATE,
        UpdatedOn: Sequelize.DATE,
        DeletedOn: Sequelize.DATE,
        sLat: Sequelize.STRING,
        sLon: Sequelize.STRING,
        idLotePedido: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Pedidos',
        hasTrigger: true
      })
}