/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TiposPedidosXTiposDoc', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iTipoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'TiposPedidosXTiposDoc',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
