/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subcanales', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idSubcanal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idCanal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombreCorto: {
      type: DataTypes.STRING,
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
    tableName: 'Subcanales',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
