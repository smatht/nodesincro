const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ARV_FinDia', {
      id: { type: Sequelize.UUID, primaryKey: true },
      idVendedor: Sequelize.INTEGER,
      fecha: Sequelize.DATE
    }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'ARV_FinDia'
      })
}