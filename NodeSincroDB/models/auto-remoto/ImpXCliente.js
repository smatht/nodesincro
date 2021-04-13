/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ImpXCliente', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idImpuesto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rValorImpuesto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fVigencia: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usuario_creacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
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
    tableName: 'ImpXCliente',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
