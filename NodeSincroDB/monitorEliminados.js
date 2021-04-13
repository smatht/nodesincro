'use strict'

const Sequelize = require('sequelize')
var waitUntil = require('wait-until')
const Op = Sequelize.Op
const fs = require('fs');
var Mkdirp = require('mkdirp');
var opts
const Conexion = require('./conexion')
const NodeLogger = require('simple-node-logger')
const Timer = require('./ARVTimer').Timer

Mkdirp('logs/', function(err) { 
})

const nameLogFile = 'monitorEliminados'

let i;
let count = 0;
fs.createReadStream(`./logs/${nameLogFile}.log`)
  .on('error', e => {
    opts = {
      logFilePath:`./logs/${nameLogFile}.log`,
      timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
    }
  })
  .on('data', chunk => {
      for (i=0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
  })
  .on('end', () => {
    if (count > 25) {
      fs.unlink(`./logs/${nameLogFile}.log`, (err) => {
        if (err) throw err;
        opts = {
          logFilePath:`./logs/${nameLogFile}.log`,
          timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
        }
      })
    }
    else {
      opts = {
        logFilePath:`./logs/${nameLogFile}.log`,
        timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
      }
    }
  })


// idEmpresa para debuguear
var idEmpresa = process.env.NODESINCRO_IDEMPRESA
// Cada cuanto tiempo se ejecuta el loop (minutos)
var minutosEjecucion = 5
var connLocal = false
var connRemoto = false

// Tablas a monitorizar
const tablas = ['DocCuenta', 'Pedidos', 'PedidosItems', 'PedidosItemsDescuentos',  
                'DescXPV','DescXProducto', 'DescXVendedor', 'DescXCliente',  
                'DescXLista', 'ImpXPV', 'ImpXProducto', 'ImpXCliente', 'ImpXLista', 
                'ProductosXVendedor', 'Stock', 'Clientes', 'ObjetivosPorVendedor', 
                'ObjetivosPorVendedorDetalle',  'Descuentos', 'ClientesPorEncuesta']

async function main () {
  const log = NodeLogger.createSimpleLogger( opts )

  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal({ 
    query: { raw: false }
  })
  var remoteDB = Conexion.ConexionRemota({ 
    query: { raw: false },
    pool: {max : 2, min: 0}
  })

  localDB
    .authenticate()
    .then(() => {
      connLocal = true
      log.info('Conectado a base de datos local.')
    })
    .catch(err => {
      log.error('No se puede conectar con base de datos local:', err)
      throw true;
    })

  remoteDB
    .authenticate()
    .then(() => {
      connRemoto = true
      log.info('Conectado a base de datos remota.')
    })
    .catch(err => {
      log.error('No se puede conectar con base de datos remota:', err)
      throw true;
    })

// ########################################################################################
// DEFINICION DE MODELOS  -------------------------------------------------------------
// ########################################################################################

    // Modelo [DMLLOG_ELIMINADOS] BD local
  const Eliminados = localDB.define('DMLLOG_ELIMINADOS', {
      idEliminado: { type: Sequelize.INTEGER, primaryKey: true },
      id: Sequelize.UUID,
      sTabla: Sequelize.STRING,
      fEliminado: Sequelize.DATE,
      bProcesado: Sequelize.SMALLINT
    }, {
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
      tableName: 'DMLLOG_ELIMINADOS'
    })

  const Pedidos = remoteDB.define('Pedidos', {
      id: { type: Sequelize.UUID, primaryKey: true },
      idPedido: Sequelize.INTEGER,
      idVendedor: Sequelize.INTEGER,
      idCliente: Sequelize.INTEGER,
      sObservaciones: Sequelize.STRING,
      fPedido: Sequelize.DATE,
      fEntrega: Sequelize.DATE,
      idCondVenta: Sequelize.STRING,
      idCondPago: Sequelize.STRING,
      idMoneda: Sequelize.INTEGER,
      rTotDescuentos: Sequelize.REAL,
      totalPedido: Sequelize.REAL,
      totalImpuesto: Sequelize.REAL,
      totalNeto: Sequelize.REAL,
      iTipoPedido: Sequelize.INTEGER,
      idEmpresa: Sequelize.INTEGER,
      hInicio: Sequelize.STRING,
      hFin: Sequelize.STRING,
      rDescuento: Sequelize.REAL,
      InsertedOn: Sequelize.DATE,
      UpdatedOn: Sequelize.DATE,
      DeletedOn: Sequelize.DATE
    }, {
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
      tableName: 'Pedidos'
    })

  const DocCuenta = remoteDB.define('DocCuenta', {
      id: { type: Sequelize.UUID, primaryKey: true },
      idEmpresa: Sequelize.INTEGER,
      DeletedOn: Sequelize.DATE
    }, {
      timestamps: false,
      paranoid: true,
      freezeTableName: true,
      tableName: 'DocCuenta'
    })

  const PedidosItems = remoteDB.import("models/remoto/pedidosItems")
  const PedidosItemsDescuentos = remoteDB.import("models/remoto/pedidosItemsDescuentos")

  const DescXPV = remoteDB.define('DesXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXPV'
  })

  const DescXProducto = remoteDB.define('DescXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXProducto'
  })

  const DescXCliente = remoteDB.define('DescXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXCliente'
  })

  const DescXLista = remoteDB.define('DescXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXLista'
  })

  const DescXVendedor = remoteDB.define('DescXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'DescXVendedor'
  })

  const ImpXLista = remoteDB.define('ImpXLista', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXLista'
  })

  const ImpXCliente = remoteDB.define('ImpXCliente', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXCliente'
  })

  const ImpXProducto = remoteDB.define('ImpXProducto', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXProducto'
  })

  const ImpXPV = remoteDB.define('ImpXPV', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ImpXPV'
  })

  const ProductosXVendedor = remoteDB.define('ProductosXVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ProductosXVendedor'
  })

  const Stock = remoteDB.define('Stock', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'Stock'
  })

  const Clientes = remoteDB.define('Clientes', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'Clientes'
  })

  const ObjetivosPorVendedor = remoteDB.define('ObjetivosPorVendedor', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ObjetivosPorVendedor'
  })

  const ObjetivosPorVendedorDetalle = remoteDB.define('ObjetivosPorVendedorDetalle', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ObjetivosPorVendedorDetalle'
  })

  const Descuentos = remoteDB.define('Descuentos', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'Descuentos'
  })

  const ClientesPorEncuesta = remoteDB.define('ClientesPorEncuesta', {
    id: {type: Sequelize.UUID, primaryKey: true},
    idEmpresa: Sequelize.INTEGER,
    DeletedOn: Sequelize.DATE
  }, {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    tableName: 'ClientesPorEncuesta'
  })

// ########################################################################################
// FIN DEFINICION DE MODELOS  ---------------------------------------------------------
// ########################################################################################

  // Devuelve la fecha con tres horas menos. UTC -> UTC-3
  // 
  Date.prototype.utc3 = function() {    
    this.setTime(this.getTime() - (3*60*60*1000)); 
    return this;   
  }

  function getEliminados() {
      return new Promise(resolve => {
          Eliminados.findAll({
              where: {
                bProcesado: 0,
                id: {
                  [Op.ne]: null
                }
              },
              limit: 5000
            }).then(elim => {
              resolve(elim);
            })
            .catch(err => {
              resolve(null);
            })
        });
  }

  function marcarProcesado (id, accion) {
    Eliminados.findAll({
      where: {
        id
      }
    }).then(elim => {
      for (var i in elim) {
        elim[i].bProcesado = 1
        elim[i].update({bProcesado: 1}).then(() => {
          if (accion === 'Eliminado ')
            log.info(accion + elim[i].sTabla + ' {' + elim[i].id + '}') 
        })
      }
    })
    .catch(err => {
      log.warn(err);
    })
  }

  async function loopMonitor () {
    var eliminados
    var cantidad

    eliminados = await getEliminados()

    try {
      cantidad = eliminados.length
    }
    catch (err) {
      cantidad = 0
    }

    if (cantidad > 0)
      log.info('Verificando eliminados: ' + cantidad.toString() + ' registros.')
    console.log('Verificando eliminados: ' + cantidad.toString() + ' registros.')
    
    for (var i = 0; i < cantidad; i++) {
      if (tablas.includes(eliminados[i].sTabla)) {
        await eval(eliminados[i].sTabla).findByPk(eliminados[i].id).then(doc => {
            if (doc != null && doc != undefined) {
              doc.updateAttributes({DeletedOn: localDB.fn('NOW')}).then(() => { 
                  marcarProcesado(doc.id, 'Eliminado ')
                })
            }
            else {
              marcarProcesado(eliminados[i].id, 'Procesado ')
            }
          })
        
      }
    }    
    setTimeout(loopMonitor, 60000 * minutosEjecucion );   
  }

  // Ejecuta loopMonitor cuando se establecen las dos conexion
  waitUntil()
      .interval(500)
      .times(Infinity)
      .condition(function () {
        return (connLocal && connRemoto)
      })
      .done(function (result) {
        console.log('Se lanzo ' + connLocal + ' ' + connRemoto)  
        loopMonitor()
      })

  /**
  * Instancia un timer que se usa para reiniciar el proceso cada cierto tiempo especificado 
  */
  var timer = new Timer(function() {
    setImmediate(()=>{
      process.exit(0)
  });
  }, 43200000); // cada 12 hs...
}

waitUntil()
.interval(500)
.times(Infinity)
.condition(function () {
  return (opts !== undefined)
})
.done(function (result) {
  if (result) {
    main()
  }
})
