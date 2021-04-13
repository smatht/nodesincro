/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OpcionesPorPregunta', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idPregunta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idOpcion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sDescripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    pregunta_fk: {
      type: DataTypes.UUIDV4,
      allowNull: true,
      references: {
        model: 'PreguntasPorEncuesta',
        key: 'id'
      }
    }
  }, {
    tableName: 'OpcionesPorPregunta',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
