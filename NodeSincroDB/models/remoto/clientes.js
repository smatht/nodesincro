const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Clientes', {
      id: {type: Sequelize.UUID, primaryKey: true },
      idCliente: { type: Sequelize.INTEGER},
      idEmpresa: Sequelize.INTEGER,
      sCodCliente: Sequelize.STRING,
      sCodigoTrib: Sequelize.STRING,
      sRazonSocial: Sequelize.STRING,
      sNombreFantasia: Sequelize.STRING,
      sTelefono: Sequelize.STRING,
      sEmail: Sequelize.STRING,
      Usuario_Modificacion: Sequelize.STRING,
      Fecha_Modificacion: Sequelize.DATE,
      Usuario_Creacion: Sequelize.STRING,
      Fecha_Creacion: Sequelize.DATE,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE,
      sLat: Sequelize.STRING,
      sLon: Sequelize.STRING,
      bVLun: Sequelize.SMALLINT,
      bVMar: Sequelize.SMALLINT,
      bVMie: Sequelize.SMALLINT,
      bVJue: Sequelize.SMALLINT,
      bVVie: Sequelize.SMALLINT,
      bVSab: Sequelize.SMALLINT,
      bVDom: Sequelize.SMALLINT,
      sDirCalle: Sequelize.STRING,
      sDirEntreCalles: Sequelize.STRING,
      sDirNumero: Sequelize.STRING,
      sUbicZona: Sequelize.STRING,
      sUbicCuadra: Sequelize.STRING,
      bVLunDirecta: Sequelize.SMALLINT,
      bVMarDirecta: Sequelize.SMALLINT,
      bVMieDirecta: Sequelize.SMALLINT,
      bVJueDirecta: Sequelize.SMALLINT,
      bVVieDirecta: Sequelize.SMALLINT,
      bVSabDirecta: Sequelize.SMALLINT,
      bVDomDirecta: Sequelize.SMALLINT,
      fAlta: Sequelize.DATE,
      idVendedor: Sequelize.INTEGER,
      idLista: Sequelize.INTEGER,
      idCondVenta: Sequelize.STRING,
      idcondpago: Sequelize.STRING,
      sDireccion: Sequelize.STRING,
      sObservaciones: Sequelize.STRING,
      bActivo: Sequelize.SMALLINT,
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Clientes',
        hasTrigger: true
      })
}