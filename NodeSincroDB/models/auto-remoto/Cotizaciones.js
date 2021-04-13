/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Cotizaciones', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCotizacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idMoneda: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    fFecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rCambio: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rCambioAnt: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fFechaHasta: {
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
    tableName: 'Cotizaciones',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
