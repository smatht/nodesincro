/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TiposDoc', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idTipoDoc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iAplicStock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bEsFactura: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iTipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idPlantillaFac: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sTipoNC: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sLetra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoComprobanteAFIP: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bInformarMassalin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iDiasVencimiento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    iAplicCaja: {
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
    tableName: 'TiposDoc',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
