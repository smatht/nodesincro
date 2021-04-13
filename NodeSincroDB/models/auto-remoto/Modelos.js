/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Modelos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
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
    },
    idPV: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Modelos'
  });
};
