/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ObjetivosPorVendedorDetalle', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true
    },
    idObjetivo: {
      type: DataTypes.UUIDV4,
      allowNull: false
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rValor: {
      type: DataTypes.REAL,
      allowNull: false
    },
    rCumplido: {
      type: DataTypes.REAL,
      allowNull: false
    },
    UpdatedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    InsertedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DeletedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'ObjetivosPorVendedorDetalle',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
