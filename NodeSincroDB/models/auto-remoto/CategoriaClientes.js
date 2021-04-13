/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CategoriaClientes', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDescripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sFiscal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sNomCorto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iCategoriaMassalin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idClienteModelo: {
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
    tableName: 'CategoriaClientes',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
