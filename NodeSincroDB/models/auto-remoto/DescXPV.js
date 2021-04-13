/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DescXPV', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idDescuento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idPV: {
      type: DataTypes.INTEGER,
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
    }
  }, {
    tableName: 'DescXPV',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
