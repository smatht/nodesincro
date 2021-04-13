/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Encuestas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEncuesta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iObligatoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sDescripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fVigenciaDesde: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fVigenciaHasta: {
      type: DataTypes.DATE,
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
    }
  }, {
    tableName: 'Encuestas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
