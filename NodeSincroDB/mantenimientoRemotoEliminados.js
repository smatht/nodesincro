'use strict'

// Install node-windows
// npm install -g node-windows
// npm link node-windows

const _ = require('underscore')
const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
var waitUntil = require('wait-until')
var Mkdirp = require('mkdirp');
const fs = require('fs');
const Conexion = require('./conexion')

Mkdirp('logs/', function(err) { 
})

// create a custom timestamp format for log statements
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'logs/mantenimientoRemoto' + Date.now().toString() + '.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger( opts );

const idEmpresa = process.env.NODESINCRO_IDEMPRESA

const tablas = ['DocCuenta', 'ProductosXVendedor', 'DescXPV', 'DescXProducto', 'DescXCliente', 'DescXLista', 'DescXVendedor', 
                'ImpXPV', 'ImpXProducto', 'ImpXCliente', 'ImpXLista']

// Inicializar Sequelize para conectar a la BD local
var localDB = Conexion.ConexionLocal
var remoteDB = Conexion.ConexionRemota

localDB
.authenticate()
.then(() => {
    log.info('Conectado a base de datos local.')
})
.catch(err => {
    log.error('No se puede conectar con base de datos local:', err)
})

remoteDB
.authenticate()
.then(() => {
    log.info('Conectado a base de datos remota.')
})
.catch(err => {
    log.error('No se puede conectar con base de datos remota:', err)
})

const DescXPV = localDB.define('DesXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXPV'
})

const PgDescXPV = remoteDB.define('DesXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXPV'
})

const DescXProducto = localDB.define('DescXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXProducto'
})

const PgDescXProducto = remoteDB.define('PgDescXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXProducto'
})

const DescXCliente = localDB.define('DescXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXCliente'
})

const PgDescXCliente = remoteDB.define('DescXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXCliente'
})

const ProductosXVendedor = localDB.define('ProductosXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ProductosXVendedor'
})

const PgProductosXVendedor = remoteDB.define('ProductosXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ProductosXVendedor'
})

const DocCuenta = localDB.define('DocCuenta', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DocCuenta'
})

const PgDocCuenta = remoteDB.define('DocCuenta', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DocCuenta'
})

const DescXLista = localDB.define('DescXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXLista'
})

const DescXVendedor = localDB.define('DescXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXVendedor'
})

const PgDescXLista = remoteDB.define('DescXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXLista'
})

const PgDescXVendedor = remoteDB.define('DescXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXVendedor'
})

// IMPUESTOS
const ImpXPV = localDB.define('ImpXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXPV'
})

const PgImpXPV = remoteDB.define('ImpXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXPV'
})

const ImpXLista = localDB.define('ImpXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXLista'
})

const PgImpXLista = remoteDB.define('ImpXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXLista'
})

const ImpXCliente = localDB.define('ImpXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXCliente'
})

const PgImpXCliente = remoteDB.define('ImpXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXCliente'
})

const ImpXProducto = localDB.define('ImpXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXProducto'
})

const PgImpXProducto = remoteDB.define('ImpXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXProducto'
})

function comparaRemotoLocal (remoto, local) {
    var noEncontrados = []

    // Compara remoto con local. Los que no existen en local seran devueltos por la func
    for (var i = 0; i < remoto.length; i++) {
        if (!local.includes(remoto[i])) {
            noEncontrados.push(remoto[i])
        }
    }

    return noEncontrados
}

async function eliminarEnRemoto (sTabla, eliminadosEnLocal) {
    log.info('Eliminando en remoto '+ sTabla + '...')

    for (var i in eliminadosEnLocal) {

        await eval('Pg'+sTabla).update({
            DeletedOn: new Date()
          }, {
            where: {
                id: eliminadosEnLocal[i],
            }
          }).then(() => {
            log.info('Eliminado ' + ' {' + eliminadosEnLocal[i] + '}')
          })
          .catch(function (error) {
          log.error('No se pudo eliminar en base de datos remota')
          log.error(error)
        })
    }
}

async function main (sTabla) {
    var registrosLocales = await eval(sTabla).findAll({
        attributes: ['id']
    })

    var registrosRemotos = await eval('Pg'+sTabla).findAll({
        attributes: ['id'],
        where: {
            idEmpresa: idEmpresa,
            DeletedOn: null
            }
    })

    var idsLocales = _.map(registrosLocales, function(registrosLocales) { return registrosLocales.id.toLowerCase() })
    var idsRemotos = _.map(registrosRemotos, function(registrosRemotos) { return registrosRemotos.id })
    var paraEliminar = comparaRemotoLocal(idsRemotos, idsLocales)
    log.info('Registros buscados en tabla: ' + sTabla)
    log.info('Registros locales encontrados: ' + registrosLocales.length)
    log.info('Registros remoto encontrados: ' + registrosRemotos.length)
    log.info('Registros para eliminar: ' + paraEliminar.length)
    if (paraEliminar.length > 0)
        eliminarEnRemoto(sTabla, paraEliminar)
}

for (var i in tablas)
    main(tablas[i])