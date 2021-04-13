/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Productos', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idFamilia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sShortNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idProveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iStockMinimo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    iStockMaximo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idUnidadPredet: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sCodBarra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCodProducto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cCosto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sVariedad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bEsImplicito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idImplicito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iUbicacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sMagnitud1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCodProveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rCoeficiente: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bEsCombo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDiasStock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iFactConversion: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rDescuentoPorcentual: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rLimiteDescuentoPorcentual: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idTipoProd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    s_Num_Cuenta_Mercaderia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    s_Num_Cuenta_Venta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    s_Num_Cuenta_Costo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rValorMagnitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idMagnitud: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sLeyendaCyO: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rPunto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sCodBarra2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bPesable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bDestacado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bContenedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigoAfip: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iStockActual: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
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
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Productos',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
