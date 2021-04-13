const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('INTERFAZ_RECIBOS', {
      Importacion_id: {type: Sequelize.INTEGER, primaryKey: true},
      idRecibo: Sequelize.INTEGER,
      iLinea: Sequelize.INTEGER,
      rImpRecibo: Sequelize.REAL,
      fRecibo: Sequelize.DATE,
      idCliente: Sequelize.INTEGER,
      idMoneda: Sequelize.INTEGER,
      fCarga: Sequelize.DATE,
      rDisponible: Sequelize.REAL,
      rCambio: Sequelize.REAL,
      bAnulado: Sequelize.BOOLEAN,
      idMonedaReferencia: Sequelize.INTEGER,
      rCambioReferencia: Sequelize.INTEGER,
      iTipo: Sequelize.INTEGER,
      cImporte: Sequelize.REAL,
      idBanco: Sequelize.INTEGER,
      sNumCheque: Sequelize.STRING,
      idTarjeta: Sequelize.INTEGER,
      sNumeroCuenta: Sequelize.STRING,
      idLoteCupon: Sequelize.INTEGER,
      idCupon: Sequelize.INTEGER,
      idClienteRetencion: Sequelize.INTEGER,
      idPvRetencion: Sequelize.INTEGER,
      idNumDocRetencion: Sequelize.INTEGER,
      idImpuestoRetencion: Sequelize.INTEGER,
      idTransferenciaBanco: Sequelize.INTEGER,
      idTipoDoc: Sequelize.STRING,
      idProveedor: Sequelize.INTEGER,
      idNumDoc: Sequelize.INTEGER,
      idDepositoBanco: Sequelize.INTEGER,
      Importacion_iEstado: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      idRefNumDoc: Sequelize.INTEGER,
      idRefPv: Sequelize.INTEGER,
      idRefTipoDoc: Sequelize.STRING,
      idVendedor: Sequelize.INTEGER,
      sNumTransferencia: Sequelize.STRING,
      id: Sequelize.UUID
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'INTERFAZ_RECIBOS',
        hasTrigger: true
      })
}