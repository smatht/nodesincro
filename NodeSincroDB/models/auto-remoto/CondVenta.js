/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CondVenta', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCondVenta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bContado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iCantCuotas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rCalcCuota: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    iDiasPlazo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iPlazoCuota1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsTarjeta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsRestrictiva: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rComision: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bActivo: {
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
    }
  }, {
    tableName: 'CondVenta',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
