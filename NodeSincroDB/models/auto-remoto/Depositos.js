/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Depositos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idDeposito: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fStockIni: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bDepositoMovil: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivo: {
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
    tableName: 'Depositos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
