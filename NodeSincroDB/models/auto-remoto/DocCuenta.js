/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DocCuenta', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    iCuota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idPV: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idNumDoc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rImpCuota: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rImpPagado: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rImpSaldo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fCancelada: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sEstado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rTotFactura: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    iCantCuotas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDiasAtraso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fVtoCuota: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idMoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fDocumento: {
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
    tableName: 'DocCuenta',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
