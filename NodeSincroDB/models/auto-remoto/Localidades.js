/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Localidades', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
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
    idProvincia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sCodPostal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idDepartamento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    scodlocalidad: {
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
    tableName: 'Localidades',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
