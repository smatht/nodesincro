/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MotivosNoCompra', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idMotivoNoCompra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    sDescripcion: {
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
    tableName: 'MotivosNoCompra',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
