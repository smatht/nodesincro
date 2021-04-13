const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DMLLOG_ELIMINADOS', {
      idEliminado: { type: Sequelize.INTEGER, primaryKey: true },
      id: { type: Sequelize.UUID, primaryKey: true },
      sTabla: Sequelize.STRING,
      fEliminado: Sequelize.DATE,
      bProcesado: Sequelize.SMALLINT
    }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'DMLLOG_ELIMINADOS'
      })
}