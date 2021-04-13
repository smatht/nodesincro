const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FinDia', {
        id: {type: Sequelize.UUID, primaryKey: true},
        idEmpresa: Sequelize.INTEGER,
        idVendedor: Sequelize.INTEGER,
        fDesde: Sequelize.DATE,
        fHasta: Sequelize.DATE,
        fecha: Sequelize.DATE,
        iCantPedidos: Sequelize.INTEGER,
        iCantPedidosItems: Sequelize.INTEGER,
        iCantPedidosItemsDescuentos: Sequelize.INTEGER,
        iCantRecibos: Sequelize.INTEGER,
        iCantPagos: Sequelize.INTEGER,
        iEstado: Sequelize.INTEGER
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'FinDia',
        hasTrigger: true
      })
}
