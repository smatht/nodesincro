'use strict'

/**
   * Microservicio de descarga de motivos de no compra. 
   * Mantiene una conexion persistente con postgresql y escucha los canales:
   *   - nuevo_motivo
   * @author - Matias G. Sticchi
*/

const EventEmitter = require('events')
const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const waitUntil = require('wait-until')
const Mkdirp = require('mkdirp')
const fs = require('fs')
const NodeLogger = require('simple-node-logger')
const Conexion = require('./conexion')
const { obtenerVendedoresDeSucursal } = require('./utils')
var argv = require('minimist')(process.argv.slice(2))
const Timer = require('./ARVTimer').Timer
var opts

Mkdirp('logs/', () => { 
})

const nameLogFile = 'descargaMotivos'

// Abre el archivo de log, si tiene mas de 25 lineas lo renombra para crear un nuevo archivo de log
let i;
let count = 0;
fs.createReadStream('./logs/descargaMotivos.log')
  .on('error', () => {
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

async function main () {
  const log = NodeLogger.createSimpleLogger( opts );
  const idEmpresa = process.env.NODESINCRO_IDEMPRESA
  const idSucursal = process.env.NODESINCRO_IDSUCURSAL || -1
  var vendedores = []
  var localOpts = {}
  var todo = argv["todo"]
  var fdesde = argv["desde"]
  //var tmz = argv["tmz"]

  localOpts.timezone = '-03:00'
  console.log(localOpts)
  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal(localOpts)
  var remoteDB = Conexion.ConexionRemota( { pool: {max : 2, min: 0} } )

  try {
    await localDB.authenticate()
    await remoteDB.authenticate()
  } catch (e) {
    log.fatal(e.message)
    setTimeout(() => {
      process.exit(1)
    }, 10000)
  }

  const Vendedores = localDB.import("models/local/vendedores")
  const rMotivosNoCompraXCliente = remoteDB.import("models/remoto/motivosNoCompraXCliente")
  const lMotivosNoCompraXCliente = localDB.import("models/local/motivosNoCompraXCliente")

  vendedores = await obtenerVendedoresDeSucursal(idSucursal, Vendedores)
  for (let i in vendedores) {
    await sincronizarMotivos(vendedores[i])
  } 

  /**
   * ***************************************
   * FUNCIONES PRINCIPALES
   * ***************************************
   */

   // SINCRONIZACION DE PEDIDOS
  // inicia la sincro de pedidos no descargados aun. Se ejecuta solo una vez al iniciar el proceso.
  async function sincronizarMotivos (idVendedor) {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    var fechaDesde = new Date(new Date().setDate(new Date().getDate()-5))
    
    if (todo)
      fechaDesde = new Date(Date.UTC(2001, 1, 1, 0, 0, 0, 0))
    if(fdesde){
      let d = fdesde.split(/\D+/)
      fechaDesde = new Date(Date.UTC(d[0], --d[1], d[2], d[3], d[4], d[5], d[6]))
    }
    
    var motivos = await rMotivosNoCompraXCliente.findAll({
      where: {
        idVendedor: {[Op.eq]: idVendedor},
        idEmpresa: idEmpresa,
        DeletedOn: null,
        fMotivo: {
          [Op.gte]: fechaDesde
        }
      }
    })

    let insertados = await CargaDeDatos(motivos)
    log.info(`Registros afectados: ${insertados} | Vendedor: ${idVendedor}`)

  }

  async function CargaDeDatos(motivos) {
    let c = 0
    for (let i in motivos) {
      let insert = []
      try {
        insert = await lMotivosNoCompraXCliente.findOrCreate({
          where: {
            id: motivos[i].id
          },
          defaults: motivos[i] 
        })
      } catch(e) {
        log.warn("AVER " + e.message)
      }
      if (insert[1])
        c += 1
    }
    return c
  }

  async function EliminarMotivo(motivos) {
    let c = 0
    for (let i in motivos) {
      let elim = []
      try {
        elim = await lMotivosNoCompraXCliente.destroy({
          where: {
            id: motivos[i].id
          }
        })
      } catch(e) {
        log.warn(e.message)
      }
    }
  }

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~ DEFINICION Y REGISTRO A LOS CANALES DE EVENTOS  ~~~~~~~~~~
  // **************************************************************************
  // **************************************************************************
  function DbEventEmitter () {
    EventEmitter.call(this)
  }

  util.inherits(DbEventEmitter, EventEmitter)
  var dbEventEmitter = new DbEventEmitter()
  
  var client = Conexion.ConexionPG
  client.connect().then(err => {
    if (err) {
      log.fatal('No se puede escuchar')
    }
    log.info('Escuchando base de datos remota')
  })
  client.query('LISTEN nuevo_motivo_' + idEmpresa)
  client.on('notification', function (msg) {
    let payload = JSON.parse(msg.payload)
    log.debug('Se emitio: ' + msg.channel)
    dbEventEmitter.emit(msg.channel, payload)
  })

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~ MANEJADORES DE EVENTOS DE BASE DE DATOS  ~~~~~~~~~~~~~~~~~
  // **************************************************************************
  // **************************************************************************
  dbEventEmitter.on('nuevo_motivo_' + idEmpresa, (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return
    if (msg.DeletedOn) {
      EliminarMotivo([msg])
      log.info(`Motivo no compra eliminado: ${msg.id}`)
    } else {
      let carga = CargaDeDatos([msg])
      const objPrint =  {idVendedor: msg.idVendedor, id: msg.id};
      if (carga)
        log.info(`Motivo no compra interceptado: ${JSON.stringify(objPrint)}`)
    }
  })


  /**
   * Instancia un timer que se usa para reiniciar el proceso cada cierto tiempo especificado 
   */
  var timer = new Timer(function() {
    log.info('Reinicio programado...')
    setImmediate(()=>{
      process.exit(0)
  });
  }, 43200000); // cada 12 hs...

}

Date.prototype.utc3 = function() {    
  this.setTime(this.getTime() - (3*60*60*1000))
  return this
}

waitUntil()
.interval(500)
.times(Infinity)
.condition(function () {
  return (opts !== undefined)
})
.done(() => {
  main()
})
