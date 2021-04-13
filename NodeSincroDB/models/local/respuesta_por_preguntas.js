const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('RespuestaPorPreguntas', {
        id: {type: Sequelize.UUID, primaryKey: true},
        idCliente: Sequelize.INTEGER,
        idEncuesta: Sequelize.INTEGER,
        idPregunta: Sequelize.INTEGER,
        fTomaDeEncuesta: Sequelize.DATE,
        sRespuesta: Sequelize.STRING,
        sOperador: Sequelize.STRING,
        sDipositivo: Sequelize.STRING
      }, {
        timestamps: false,
        paranoid: true,
        freezeTableName: true,
        tableName: 'RespuestaPorPreguntas',
        hasTrigger: true
      })
}
