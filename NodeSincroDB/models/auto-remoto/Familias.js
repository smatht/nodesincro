/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Familias', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idFamilia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    idLinea: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sNombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iGrupo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rPorcentaje: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bPermitirDescuentos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bInformarMassalin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bUsarListaDePrecios: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idLista: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iCantidadDesde: {
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
    tableName: 'Familias',
    timestamps: false,
    freezeTableName: true,
    hasTrigger: true
  });
};
