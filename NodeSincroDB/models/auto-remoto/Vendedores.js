/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Vendedores', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sApellido: {
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
    sEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idPais: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProvincia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idPV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idSucursal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bCambioLista: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rPorcDescuento: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bCambioPrecio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bCambiaRuta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPrecioVenta0: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idDeposito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsSupervisor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bLimitaacredito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVendedorMostrador: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sDNI: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCodigoTrib: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fIngreso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rSueldo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sLegajo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bPermitePedidoPresupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPermiteConfDesc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPermiteCambioNumeracion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipoDispositivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bInformaStock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPermiteDescuentoCab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idVendedorSupervisor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bFacturarContadoClienteMoroso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVentaStockNeg: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iUltPedido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iUltRecibo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bPermiteVenta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bAgruparLimiteSegunTipoImpuesto: {
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
    },
    sDeviceInfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sOsName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sOsVersion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bBloqueaPedidoClienteMoroso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bRestringirUsoSinGps: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Vendedores',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
