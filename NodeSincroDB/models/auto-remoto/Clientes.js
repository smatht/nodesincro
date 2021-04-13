/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Clientes', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    sCodigoTrib: {
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
    sFax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fAlta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idPais: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProvincia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idLocalidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sRazonSocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idLista: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCondVenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idVendedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bCredito: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCanal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idSubcanal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idZona: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idBarrio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idRutaV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iSeqV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idRutaE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iSeqE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVLun: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVMar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVMie: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVJue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVVie: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVSab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVDom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sObservaciones: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idCategoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fModificacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    iGrupoABC: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idClienteBillTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iFlagBillTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rSueldo: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    idOcupacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDNI: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    idEstadoCivil: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bFranquiciado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idDepartamento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombreFantasia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDirCalle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDirEntreCalles: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sDirNumero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sUbicZona: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sUbicCuadra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iImportanciaEstrategica: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idSubCanalAp1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idSubCanalAp2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fBaja: {
      type: DataTypes.DATE,
      allowNull: true
    },
    iLocal: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sCodNielsen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcondpago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mLimiteCredito: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    iVentaDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iMapInfo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sClasifKraft: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Usuario_Creacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Usuario_Modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Fecha_Modificacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    iSeqPosis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEstaActivo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    bVLunDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVMarDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVMieDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVJueDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVVieDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVSabDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bVDomDirecta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idDocContribuyente: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idVendedor2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Lun: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Mar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Mie: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Jue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Vie: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Sab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bV2Dom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    s_Num_Cuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idContribuyenteDGR: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sContribuyenteDGR: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mLimiteDirecta: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sCodCliente: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sCoordenadas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rTotalPunto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bFidelizacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipoVisita: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idVendedor3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bRemitoSinFacturar: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sValor1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bRestringido: {
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
    sLat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sLon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iVentaDirecta2: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Clientes',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
