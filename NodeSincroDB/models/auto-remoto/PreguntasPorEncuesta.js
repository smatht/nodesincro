/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PreguntasPorEncuesta', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEncuesta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idPregunta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iOrden: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sPregunta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iTipoRespuesta: {
      type: DataTypes.INTEGER,
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
    },
    encuesta_fk: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'Encuestas',
        key: 'id'
      }
    }
  }, {
    tableName: 'PreguntasPorEncuesta',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
