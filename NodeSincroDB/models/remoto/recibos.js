const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Recibos', {
      id: {type: Sequelize.UUID, primaryKey: true},
      idEmpresa: { type: Sequelize.INTEGER },
      idTipoDoc: Sequelize.STRING,
      idPv: { type: Sequelize.INTEGER },
      idNumDoc: { type: Sequelize.INTEGER },
      iCuota: { type: Sequelize.INTEGER },
      iPago: { type: Sequelize.INTEGER },
      fPago: Sequelize.DATE,
      iOrigen: { type: Sequelize.INTEGER },
      rPagoCuota: Sequelize.REAL,
      idRecibo: { type: Sequelize.INTEGER },
      idTipoDocNC: Sequelize.STRING,
      idPvNC: { type: Sequelize.INTEGER },
      idNumDocNC: { type: Sequelize.INTEGER },
      idCliente: { type: Sequelize.INTEGER },
      idMoneda: { type: Sequelize.INTEGER },
      rCambio: Sequelize.REAL,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE,
      idVendedor: { type: Sequelize.INTEGER }
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Recibos',
        hasTrigger: true
      })
}