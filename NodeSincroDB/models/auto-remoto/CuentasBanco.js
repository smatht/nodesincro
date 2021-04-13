/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CuentasBanco', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idBanco: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sNumCuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rSaldo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idMoneda: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rLimiteAcuerdo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    usuario_creacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usuario_modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    s_Num_Cuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCbu: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DeletedOn: {
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
    }
  }, {
    tableName: 'CuentasBanco',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
