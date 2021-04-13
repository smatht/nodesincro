const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ImpXCliente', {
      id: {type: Sequelize.UUID, primaryKey: true },
      idEmpresa: Sequelize.INTEGER,
      idImpuesto: { type: Sequelize.INTEGER, primaryKey: true },
      idCliente: Sequelize.INTEGER,
      fVigencia: Sequelize.DATE,
      usuario_creacion: Sequelize.STRING, 
      fecha_creacion: Sequelize.DATE
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'ImpXCliente'
      })
}