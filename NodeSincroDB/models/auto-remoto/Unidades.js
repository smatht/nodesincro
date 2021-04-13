/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Unidades', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    sShortDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idUnidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iCantidad: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idSubUnidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iCantSubUnid: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rMedida1: {
      type: DataTypes.DOUBLE,
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
    tableName: 'Unidades',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
