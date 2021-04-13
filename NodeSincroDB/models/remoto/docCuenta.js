const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DocCuenta', {
        id: {type: Sequelize.UUID, primaryKey: true},
        idPedido: { type: Sequelize.INTEGER, primaryKey: true },
        idVendedor: { type: Sequelize.INTEGER, primaryKey: true },
        idCliente: Sequelize.INTEGER,
        sObservaciones: Sequelize.STRING,
        fPedido: Sequelize.DATE,
        fEntrega: Sequelize.DATE,
        idCondVenta: Sequelize.STRING,
        idCondPago: Sequelize.STRING,
        idMoneda: Sequelize.INTEGER,
        rTotDescuentos: Sequelize.REAL,
        totalPedido: Sequelize.REAL,
        totalImpuesto: Sequelize.REAL,
        totalNeto: Sequelize.REAL,
        iTipoPedido: Sequelize.SMALLINT,
        idEmpresa: Sequelize.INTEGER,
        InsertedOn: Sequelize.DATE,
        UpdatedOn: Sequelize.DATE,
        DeletedOn: Sequelize.DATE,
        sLat: Sequelize.STRING,
        sLon: Sequelize.STRING, 
        idRefPedido: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'DocCuenta',
        hasTrigger: true
      })
}