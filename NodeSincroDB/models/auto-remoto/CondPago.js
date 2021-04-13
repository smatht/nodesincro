/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CondPago', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCondPago: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iTipoValor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iOrden: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivo: {
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
    tableName: 'CondPago',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
