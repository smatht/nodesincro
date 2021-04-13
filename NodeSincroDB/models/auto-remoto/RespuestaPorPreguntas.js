/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RespuestaPorPreguntas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEncuesta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idPregunta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sRespuesta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fTomaDeEncuesta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sOperador: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sDispositivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    InsertedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdatedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DeletedOn: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'RespuestaPorPreguntas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
