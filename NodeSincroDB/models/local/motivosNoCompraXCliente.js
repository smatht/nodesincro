const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MotivosNoCompraXCliente', {
        id: {type: Sequelize.UUID, primaryKey: true},
        idVendedor: Sequelize.INTEGER,
        idMotivoNoCompra: Sequelize.INTEGER,
        fMotivo: Sequelize.DATE,
        idCliente: Sequelize.INTEGER,
        sLat: Sequelize.STRING,
        sLon: Sequelize.STRING
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'MotivosNoCompraXCliente',
        hasTrigger: true
      })
}
