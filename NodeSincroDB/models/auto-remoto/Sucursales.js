/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Sucursales', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idSucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDireccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sTelefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivaFriar: {
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
    tableName: 'Sucursales',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
