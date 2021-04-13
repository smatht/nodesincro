/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bancos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idBanco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    sNomBanco: {
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
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sCodBanco: {
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
    tableName: 'Bancos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
