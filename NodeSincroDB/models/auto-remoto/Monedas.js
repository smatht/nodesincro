/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Monedas', {
    id: {
      type: DataTypes.UUIDV4,
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
    sMoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sSimbolo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rCambio: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fFecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bBase: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDecimales: {
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
    tableName: 'Monedas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
