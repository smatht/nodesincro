/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Zonas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idZona: {
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
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPerteneceZona: {
      type: DataTypes.INTEGER,
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
    tableName: 'Zonas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
