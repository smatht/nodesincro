'use strict'

/**
   * Microservicio de descarga de modificacion de datos de clientes. 
   * Cuando se actualiza un registro de cliente, la base de datos postgre emite un evento de notificacion \
   * el cual es "escuchado" por el modulo y procesa el dato procedente.
   * 
   * Mantiene una conexion persistente con postgresql y escucha los canales:
   *   - nuevo_cliente
   * @author - Matias G. Sticchi
*/

const pg = require('pg')
const EventEmitter = require('events')
const util = require('util')
const Conexion = require('./conexion')
const uuidv4 = require('uuid/v4');
var waitUntil = require('wait-until')
var Mkdirp = require('mkdirp');
const fs = require('fs');
const NodeLogger = require('simple-node-logger')
var opts
const Timer = require('./ARVTimer').Timer

Mkdirp('logs/', function() { 
})
Mkdirp('logs/hist/', function() { 
})

const nameLogFile = 'descargaClientes'

// Abre el archivo de log, si tiene mas de 500 lineas lo renombra para crear un nuevo archivo de log
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
      fs.rename(`./logs/${nameLogFile}.log`, `./logs/hist/${nameLogFile}` + Date.now().toString() + '.log', (err) => {
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
  var arrTmpClientes = []

  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal({})
  var remoteDB = Conexion.ConexionRemota( { pool: {max : 1, min: 0} } )

  try {
    await localDB.authenticate()
    await remoteDB.authenticate()
  } catch (e) {
    log.fatal(e.message)
    setTimeout(() => {
      process.exit(1)
    }, 10000)
  }

  const Clientes = localDB.import("models/local/clientes")
  const ImpXCliente = localDB.import("models/local/impxcliente")
  const DescXCliente = localDB.import("models/local/descxcliente")
  const PgClientes = remoteDB.import("models/remoto/clientes")
  const PgImpXCliente = remoteDB.import("models/remoto/impxcliente")
  const PgDescXCliente = remoteDB.import("models/remoto/descxcliente")
  const TMPClientes = remoteDB.import("models/auto-remoto/TMPClientes")

  // Build and instantiate our custom event emitter
  function DbEventEmitter () {
      EventEmitter.call(this)
  }

  util.inherits(DbEventEmitter, EventEmitter)
  var dbEventEmitter = new DbEventEmitter()

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Funciones de utilitarias
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function getProximoIdCliente () {
    return new Promise(resolve => {
      Clientes.findAll({
        attributes: ['idCliente'],
        order: [
          [localDB.fn('max', localDB.col('idCliente')), 'DESC']
        ],
        limit: 1,
        group: ['idCliente']
      })
      .then(function (ultimo) {
        if (ultimo[0] === undefined) { resolve(1) } else { resolve(parseInt(ultimo[0].idCliente) + 1) }
      })
      .catch(function (err) {
        resolve(-1)
      })
    })
  }

  function getImpuestosCliente (idCliente) {
    return new Promise((resolve, reject) => {
      ImpXCliente.findAll({
        attributes: ['idImpuesto', 'fVigencia'],
        where: {
          idCliente: idCliente
        }
      })
      .then(impuestos => {
        resolve(impuestos)
      })
      .catch(function (err) {
        reject(err)
      })
    })
  }

  function getDescuentosCliente (idCliente) {
    return new Promise((resolve, reject) => {
      DescXCliente.findAll({
        attributes: ['idDescuento', 'idCliente'],
        where: {
          idCliente: idCliente
        }
      })
      .then(impuestos => {
        resolve(impuestos)
      })
      .catch(function (err) {
        reject(err)
      })
    })
  }

  function guardar(obj) {   
    let a = arrTmpClientes.filter(f => { return f.id == obj.id })
    if (!a.length) {
      arrTmpClientes.push(obj)
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Funciones de apoyo
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var tmrProcesarGuardador = new Timer(async () => {
    if ( arrTmpClientes.length ) {
      log.info('Procesando TMPClientes...')
      tmrProcesarGuardador.stop()
      await cargaDatos()
      tmrProcesarGuardador.start()
    } 
  }, 15000);

  function cargaDatos() {
    var cantProcesados = 0
    return new Promise(async (resolve) => {
      var i, obj
      let arr = arrTmpClientes.slice()
      for (i in arr) {
        obj = arr[i]
        if (obj.bEsNuevo == 0) {
          try {
            await updateCliente(obj)
            arrTmpClientes = arrTmpClientes.filter(a => a.id !== obj.id)
            log.info('Cliente id: ', obj.idCliente, ' actualizado desde el movil.')
            await actualizarDownloadedAt(obj)
          } catch (e) {
            log.warn(e.message)
          }
        }
      }
      resolve(1)
    })
  }
  
  function updateCliente (cliente) {
    console.log('Entra a Update cliente')
    let upd = {}
    if (cliente.sTelefono)
      upd.sTelefono = cliente.sTelefono
    if (cliente.sEmail)
      upd.sEmail = cliente.sEmail
    if (cliente.sLat)
      upd.sLat = cliente.sLat
    if (cliente.sLon)
      upd.sLon = cliente.sLon
    if (cliente.bVLun != 0)
      upd.bVLun = cliente.bVLun
    if (cliente.bVMar != 0)
      upd.bVMar = cliente.bVMar
    if (cliente.bVMie != 0)
      upd.bVMie = cliente.bVMie
    if (cliente.bVJue != 0)
      upd.bVJue = cliente.bVJue
    if (cliente.bVVie != 0)
      upd.bVVie = cliente.bVVie
    if (cliente.bVSab != 0)
      upd.bVSab = cliente.bVSab
    upd.Usuario_Modificacion = cliente.usuario_modificacion
    upd.Fecha_Modificacion = cliente.InsertedOn

    return new Promise((resolve, reject) => {
      Clientes.update(upd, { 
        where: { idCliente: cliente.idCliente }
      })
      .then(() => {
        resolve(cliente.idCliente)
      })
      .catch(function (error) {        
        reject(error)
      })
    })
  }

  async function addCliente (cliente) {
    let transaction; 
    try {
      var proximoIdCliente = await getProximoIdCliente()
      var sCodCliente = proximoIdCliente.toString()
      var impuestos = await getImpuestosCliente(cliente.idClienteRef)
      var descuentos = await getDescuentosCliente(cliente.idClienteRef)
    } catch (error) {
      log.error(error.message)
      return
    }
    impuestos = impuestos.map(i => {
      i.id = uuidv4()
      i.idCliente = proximoIdCliente
      i.usuario_creacion = 'NodeSincro'
      return i
    })
    descuentos = descuentos.map(d => {
      d.id = uuidv4()
      d.idCliente = proximoIdCliente
      return d
    })
    try {
      var nuevoCliente = await Clientes.create({
        id: cliente.id,
        idCliente: proximoIdCliente,
        sCodCliente: sCodCliente,
        sCodigoTrib: '23000000019',
        sTelefono: cliente.sTelefono,
        sEmail: cliente.sEmail,
        Usuario_Creacion: `NodeSincro`,
        idVendedor: cliente.idVendedor,
        Fecha_Creacion: cliente.InsertedOn, 
        sLat: cliente.sLat,
        sLon: cliente.sLon,
        bVLun: cliente.bVLun,
        bVMar: cliente.bVMar,
        bVMie: cliente.bVMie,
        bVJue: cliente.bVJue,
        bVVie: cliente.bVVie,
        bVSab: cliente.bVSab,
        bVDom: cliente.bVDom,
        sRazonSocial: cliente.sRazonSocial,
        sNombreFantasia: cliente.sRazonSocial,
        sDirCalle: cliente.sDirCalle,
        sDirEntreCalles: cliente.sDirEntreCalles,
        sDirNumero: cliente.sDirNumero,
        sUbicZona: cliente.sUbicZona ? cliente.sUbicZona : '',
        sUbicCuadra: cliente.sUbicCuadra ? cliente.sUbicCuadra : '',
        sDireccion: `${cliente.sDirCalle} ${cliente.sDirNumero}`,
        iMapInfo: 0,
        sClasifKraft: '',
        bEstaActivo: 1,
        bActivo: 1,
        bVLunDirecta: cliente.bVLun,
        bVMarDirecta: cliente.bVMar,
        bVMieDirecta: cliente.bVMie,
        bVJueDirecta: cliente.bVJue,
        bVVieDirecta: cliente.bVVie,
        bVSabDirecta: cliente.bVSab,
        bVDomDirecta: cliente.bVDom,
        sContribuyenteDGR: 0,
        rTotalPunto: 0,
        bFidelizacion: 0,
        iTipoVisita: 0,
        bRemitoSinFacturar: 0,
        fVigenciaCredito: cliente.InsertedOn,
        fAlta: cliente.InsertedOn,
        idLista: cliente.idLista,
        idCondVenta: cliente.idCondVenta,
        idCondPago: cliente.idCondPago,
        sObservaciones: `Cliente agregado por NodeSincro, vendedor: ${cliente.idVendedor}`
      })
      var nuevosImpuestos = await ImpXCliente.bulkCreate(impuestos)
      var nuevosDescuentos = await DescXCliente.bulkCreate(descuentos)
    } catch (err) {
      log.error(error.message)
      return
    }
    return {
      cliente: nuevoCliente,
      impuestos: nuevosImpuestos,
      descuentos: nuevosDescuentos
    }
  }

  async function uploadCliente (data) {
    var cliente = data.cliente.dataValues
    cliente.idEmpresa = idEmpresa
    cliente.idcondpago = cliente.idCondPago
    var impuestos = data.impuestos.map(i => {
      i.dataValues.idEmpresa = idEmpresa
      return i.dataValues
    })
    var descuentos = data.descuentos.map(d => {
      d.dataValues.idEmpresa = idEmpresa
      return d.dataValues
    })
    console.log(cliente)
    console.log(impuestos)
    console.log(descuentos)
    try {
      var nuevoCliente = await PgClientes.create(cliente)
      var nuevosImpuestos = await PgImpXCliente.bulkCreate(impuestos)
      var nuevosDescuentos = await PgDescXCliente.bulkCreate(descuentos)
    } catch (err) {
      log.error(err.message)
    }
  }

  dbEventEmitter.on('nuevo_cliente_' + idEmpresa, async (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    
    tmrProcesarGuardador.restart()
    guardar(msg)
  })
    
    // if (msg.bEsNuevo == 0) {
    //   try {
    //     var actualizar = await updateCliente(msg)
    //     if (actualizar >= 0){
    //       log.info('Cliente id: ', msg.idCliente, ' actualizado desde el movil.')
    //       actualizarDownloadedAt(msg)
    //     }
    //     else
    //       log.warn('Error al actualizar cliente: ', msg.idCliente)
    //   } catch (e) {
    //     log.fatal(e.message)
    //   }
    // }
    // else {
    //   var nuevo = await addCliente(msg)
    //   if (nuevo) {
    //     log.info('Cliente id: ', nuevo.idCliente, ' agregado desde el movil.')
    //     uploadCliente(nuevo)
    //   } else
    //     log.warn('Error al insertar cliente')
    // }



  // Definicion de la conexion Socket
  var client = Conexion.ConexionPG
  if (idEmpresa == undefined)
          throw "No se reconoce el id empresa."
  client.connect().then(() => {
    log.info('Escuchando base de datos remota')
  })
  // Suscripciones al canal (socket)
  client.query('LISTEN nuevo_cliente_' + idEmpresa)
  // Fin suscripciones

  client.on('notification', function (msg) {
    let payload = JSON.parse(msg.payload)
    log.debug('Se emitio: ' + msg.channel)
    dbEventEmitter.emit(msg.channel, payload)
  })

  function actualizarDownloadedAt(obj) {
    var ahora = new Date()
    return new Promise((resolve, reject) => {
      TMPClientes.update({DownloadedAt: ahora},
              { where: { id: obj.id } }
      )
      .then(() => {
        resolve(1)
      })
      .catch(e =>
        reject(e.message)
      )
    })
  }
}

waitUntil()
.interval(500)
.times(Infinity)
.condition(function () {
  return (opts !== undefined)
})
.done(function (result) {
  main()
})
