/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Modelos', {
    idTabla: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    iTipoSincro: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iOrderSincro: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sDescripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bVisible: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UltimaModificacionDML: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UltimaModificacionDDL: {
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
    tableName: 'Modelos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
