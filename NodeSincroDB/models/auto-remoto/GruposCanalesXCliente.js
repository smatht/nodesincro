/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GruposCanalesXCliente', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idGrupo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCanal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idSubCanal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
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
    tableName: 'GruposCanalesXCliente',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
