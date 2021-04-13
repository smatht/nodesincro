const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Clientes', {
        idCliente: { type: Sequelize.INTEGER, primaryKey: true },
        id: {type: Sequelize.UUID},
        sTelefono: Sequelize.STRING,
        sEmail: Sequelize.STRING,
        Usuario_Modificacion: Sequelize.STRING,
        Fecha_Modificacion: Sequelize.DATE,
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
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'Clientes',
        hasTrigger: true
      })
}