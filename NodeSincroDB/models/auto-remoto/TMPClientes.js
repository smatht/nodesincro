/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TMPClientes', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsNuevo: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    sTelefono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sEmail: {
      type: DataTypes.STRING,
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
    idClienteRef: {
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
    idCondPago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DownloadedAt: {
      type: DataTypes.TIME,
      allowNull: true
    },
    usuario_modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'TMPClientes',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
