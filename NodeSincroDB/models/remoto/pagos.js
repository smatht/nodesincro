const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pagos', {
		id: {type: Sequelize.UUID, primaryKey: true},
		idEmpresa: Sequelize.INTEGER,
		iPago: Sequelize.INTEGER,
		idTipoDoc: Sequelize.STRING,
		idPV: Sequelize.INTEGER,
		idNumDoc: Sequelize.INTEGER,
		iCuota: Sequelize.INTEGER,
		fPago: Sequelize.DATE,
		rPagoCuota: Sequelize.REAL,
		idRecibo: Sequelize.INTEGER,
		idTipoDocNC: Sequelize.STRING,
		idPVNC: Sequelize.INTEGER,
		idNumDocNC: Sequelize.INTEGER,
		idCliente: Sequelize.INTEGER,
		idMoneda: Sequelize.INTEGER,
		rCambio: Sequelize.REAL,
		idVendedor: Sequelize.INTEGER,
		InsertedOn: Sequelize.DATE,
		UpdatedOn: Sequelize.DATE,
		DeletedOn: Sequelize.DATE,
		reciboID: Sequelize.UUID,
		DownloadedAt: Sequelize.DATE,
		}, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Pagos',
        hasTrigger: true
      })
}