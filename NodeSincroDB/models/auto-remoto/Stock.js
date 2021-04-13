/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Stock', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idLote: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idDeposito: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iCantidad: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fVencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idTipoLote: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sCodLote: {
      type: DataTypes.STRING,
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
    iCantSub: {
      type: DataTypes.REAL,
      allowNull: true
    }
  }, {
    tableName: 'Stock',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
