/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ObjetivosPorVendedor', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      defaultValue: sequelize.fn('uuid_generate_v4'),
      primaryKey: true
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sDescripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iTipoObjetivo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iTipoAplicacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iTipoPeriodo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iTabla: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rValor: {
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
    },
    bGlobal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fVigDesde: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fVigHasta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    iCantClientes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipoOperacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'ObjetivosPorVendedor',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
