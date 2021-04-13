/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Provincias', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idProvincia: {
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
    idPais: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sLetra: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scodprovincia: {
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
    tableName: 'Provincias',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
