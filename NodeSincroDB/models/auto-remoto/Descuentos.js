/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Descuentos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idDescuento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bEsPorcentaje: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iOrden: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsCascada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rValorDescuento: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bEsTope: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsExcluyente: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsAutomatico: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsExplicito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsManual: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fDesde: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fHasta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bNoContemplaTope: {
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
    }
  }, {
    tableName: 'Descuentos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
