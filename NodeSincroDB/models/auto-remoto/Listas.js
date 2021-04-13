/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Listas', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idLista: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    sDescrip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idTipoLista: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fDesde: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fVencimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sComentario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rPorcentaje: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    idListaBase: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bModoAplicacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idMoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bIncluyeImpuestos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cDescuentoPorcentual: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bActivo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rLimiteDescuentoPorcentual: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    idSucursal: {
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
    tableName: 'Listas',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
