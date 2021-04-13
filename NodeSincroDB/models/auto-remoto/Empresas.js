/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Empresas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sRazonSocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCodigoTrib: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDireccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fInicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bActiva: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sTelefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sBase: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sEMail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sLocalidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sIngresosBrutos: {
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
    tableName: 'Empresas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
