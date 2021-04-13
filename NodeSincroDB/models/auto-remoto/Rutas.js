/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Rutas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sTipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    idRutaV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iSeqV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDiaSemana: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
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
    tableName: 'Rutas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
