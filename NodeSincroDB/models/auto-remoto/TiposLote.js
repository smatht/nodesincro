/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TiposLote', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idTipoLote: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sDescrip: {
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
    tableName: 'TiposLote',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
