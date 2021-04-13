/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Canales', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idCanal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sNombreCorto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idGrupo: {
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
    tableName: 'Canales',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
