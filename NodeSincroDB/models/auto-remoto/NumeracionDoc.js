/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NumeracionDoc', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    idPV: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    iUltimoNumero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iMaxLineas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sImpresora: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idGrupoNumeracion: {
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
    tableName: 'NumeracionDoc',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
