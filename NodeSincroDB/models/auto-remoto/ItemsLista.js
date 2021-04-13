/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ItemsLista', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idLista: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idUnidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fVigencia: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rPrecio: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hVigencia: {
      type: DataTypes.TIME,
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
    tableName: 'ItemsLista',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
