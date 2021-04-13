const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('INTERFAZ_PAGOS', {
      Importacion_id: {type: Sequelize.INTEGER, primaryKey: true},
      idTipoDoc: Sequelize.STRING,
      idPv: Sequelize.INTEGER,
      idNumDoc: Sequelize.INTEGER,
      iCuota: Sequelize.INTEGER,
      iPago: Sequelize.INTEGER,
      fPago: Sequelize.DATE,
      iOrigen: Sequelize.INTEGER,
      rPagoCuota: Sequelize.REAL,
      idRecibo: Sequelize.INTEGER,
      idTipoDocNC: Sequelize.STRING,
      idPvNC: Sequelize.INTEGER,
      idNumDocNC: Sequelize.INTEGER,
      idCliente: Sequelize.INTEGER,
      idMoneda: Sequelize.INTEGER,
      rCambio: Sequelize.REAL,
      Importacion_iEstado: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      idVendedor: Sequelize.INTEGER,
      id: Sequelize.UUID,
      reciboID: Sequelize.UUID
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'INTERFAZ_PAGOS',
        hasTrigger: true
      })
}