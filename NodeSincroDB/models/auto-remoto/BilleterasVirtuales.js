/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BilleterasVirtuales', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idBilletera: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre: {
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
    }
  }, {
    tableName: 'BilleterasVirtuales',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
