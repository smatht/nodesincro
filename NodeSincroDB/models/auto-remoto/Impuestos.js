/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Impuestos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idImpuesto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iNeto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IOrden: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fVencimiento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idMoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idTipoImpuesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNomCorto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rValorImpuesto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bEsPorcentaje: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iAplicaConcepto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    s_Num_Cuenta_Credito: {
      type: DataTypes.STRING,
      allowNull: true
    },
    s_Num_Cuenta_Debito: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rMontoMinimo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rMontoMaximo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    iTipoImpresionCompras: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipoImpresionVentas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bObligatorio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rMontoMinimoNoSujetoRetencion: {
      type: DataTypes.DOUBLE,
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
    tableName: 'Impuestos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
