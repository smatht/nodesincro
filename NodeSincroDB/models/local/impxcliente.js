const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ImpXCliente', {
      idImpuesto: { type: Sequelize.INTEGER, primaryKey: true },
      id: Sequelize.INTEGER,
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