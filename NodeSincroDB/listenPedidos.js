'use strict'

/**
   * Microservicio de descarga de pedidos.
   * Cuando se da de alta el pedido, la base de datos postgre emite un evento de notificacion \
   * el cual es "escuchado" por el modulo y procesa el dato procedente. 
   * 
   * Mantiene una conexion persistente con postgresql y escucha los canales:
   *   - nuevo_pedido
   *   - nuevo_pedido_item
   *   - nuevo_pedido_item_descuento
   *   - pedido_eliminado
   * @author - Matias G. Sticchi
*/


const _ = require('underscore')
const EventEmitter = require('events')
const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const waitUntil = require('wait-until')
const Mkdirp = require('mkdirp')
const fs = require('fs')
const NodeLogger = require('simple-node-logger')
const Timer = require('./ARVTimer').Timer
const Conexion = require('./conexion')
var opts

Mkdirp('logs/', function() { 
})
Mkdirp('logs/hist/pedidos/', function() { 
})

const nameLogFile = 'descargaPedidos'

// Abre el archivo de log, si tiene mas de 25 lineas lo renombra para crear un nuevo archivo de log
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
      fs.rename(`./logs/${nameLogFile}.log`, `./logs/hist/pedidos/${nameLogFile}` + Date.now().toString() + '.log', (err) => {
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

  var connLocal = false
  var connRemoto = false
  var vendedores = []

  // En este diccionario se relacionan los uuid de pedido (postgres) con el idPedido calculado (local)
  var clavePorIdPedido = {}
  // En este diccionario relaciona un uuid de pedido (postgres) con cada linea de pedidoItem
  // para evitar que intente insertar un descuento de una linea todavia no insertada
  var clavePorLineaPedidoItem = {}
  // Array de objetos para actualizar los idRefPedido de postgres con los idPedido calculados
  var arrActualizacionRefPedido = []
  // Array para actualizar lotePedido de cada pedido insertado segun el vendedor
  var arrLotePedido = []
  // Array de pedidos para lanzar procedimiento de regeneracion de pedido
  var arrRecalculoPedidos = []
  // Array de pedidos, items y descuentos para guardar los eventos llegados y luego procesar el conjunto de datos
  var arrEvtPedidos = []
  var arrEvtItems = []
  var arrEvtDescuentos = []
  var arrEvtEliminados = []
  var lock = false

  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal({})
  var remoteDB = Conexion.ConexionRemota( { pool: {max : 3, min: 0} } )

  localDB
    .authenticate()
    .then(() => {
      connLocal = true
      log.info('Conectado a base de datos local.')
      obtenerVendedoresDeSucursal()
    })
    .catch(err => {
      connLocal = false
      log.fatal('No se puede conectar con base de datos local:', err)
      process.exit(1)
    })

    remoteDB
    .authenticate()
    .then(() => {
      connRemoto = true
      log.info('Conectado a base de datos remota.')
    })
    .catch(err => {
      connRemoto = false
      log.fatal('No se puede conectar con base de datos remota:', err)
      process.exit(1)
    })

  // Devuelve la fecha con tres horas menos. UTC -> UTC-3
  Date.prototype.utc3 = function() {    
    this.setTime(this.getTime() - (3*60*60*1000)); 
    return this;   
  }

  function poner(arr, obj) {   
    let a = arr.filter(f => { return f.id == obj.id })
    if (!a.length) {
      arr.push(obj)
    }
    return arr
  }

  // Modelo BD local
  const Vendedores = localDB.import("models/local/vendedores")
  const Pedidos = localDB.import("models/local/pedidos")
  const PedidosItems = localDB.import("models/local/pedidosItems")
  const PedidosItemsDescuentos = localDB.import("models/local/pedidosItemsDescuentos")
  const LotesPedido = localDB.import("models/local/lotesPedido")
  const DmllogEliminados = localDB.import("models/local/dmllog_eliminados")
  // Modelo BD remota
  const PgPedidos = remoteDB.import("models/remoto/pedidos")
  const PgPedidosItems = remoteDB.import("models/remoto/pedidosItems")
  const PgPedidosItemsDescuentos = remoteDB.import("models/remoto/pedidosItemsDescuentos")
  
  /**
   * Instancia un timer que se usa para reiniciar el proceso cada cierto tiempo especificado 
   */
  var timer = new Timer(function() {
    log.info('Reinicio programado...')
    setImmediate(()=>{
      process.exit(0)
  });
  }, 1200000);

  var restartALas2Horas = new Timer(function() {
    log.info('Reinicio forzado...')
    setImmediate(()=>{
      process.exit(0)
  });
  }, 7200000);

  /**
   * Instancia un timer que se usa para procesar mensajes enviados desde postgres 
   * cada cierto tiempo especificado.
   * Inserta pedidos, items y descuentos llegados. Tambien procesa los registros 
   * eliminados  de postgres.
   */
  var tmrProcesarEventosCapturados = new Timer(async () => {
    if (arrEvtPedidos.length || arrEvtItems.length || arrEvtDescuentos.length) {
      log.info('Procesando eventos...')
      tmrProcesarEventosCapturados.stop()

      await cargaDeDatos(arrEvtPedidos, arrEvtItems, arrEvtDescuentos)
      // Verifico y limpio arrays
      let pedidosInsertados = await verificarInsertados(Pedidos, arrEvtPedidos)
      arrEvtPedidos = arrEvtPedidos.filter(p => { return !pedidosInsertados.includes(p.id) })
      let itemsInsertados = await verificarInsertados(PedidosItems, arrEvtItems)
      arrEvtItems = arrEvtItems.filter(i => { return !itemsInsertados.includes(i.id) })
      let descuentosInsertados = await verificarInsertados(PedidosItemsDescuentos, arrEvtDescuentos)
      arrEvtDescuentos = arrEvtDescuentos.filter(d => { return !descuentosInsertados.includes(d.id) })

      // Proceso eliminados y limpio array
      let eliminados = await eliminarEliminadoEnMovil(arrEvtEliminados)
      arrEvtEliminados = arrEvtEliminados.filter(e => { return !eliminados.includes(e) })

      tmrProcesarEventosCapturados.start()
    } else if (arrEvtEliminados.length) {
      // Proceso eliminados y limpio array
      let eliminados = await eliminarEliminadoEnMovil(arrEvtEliminados)
      arrEvtEliminados = arrEvtEliminados.filter(e => { return !eliminados.includes(e) })
    }
  }, 5000);

  async function obtenerVendedoresDeSucursal () {
    var where = {}
    if (idSucursal != -1) 
      where.idSucursal = idSucursal
    var vends = await Vendedores.findAll({
      attributes: ['idVendedor'],
      where: where
    })
    vendedores = _.map(vends, function(vend) { return vend.idVendedor })
  }

  // Build and instantiate our custom event emitter
  function DbEventEmitter () {
    EventEmitter.call(this)
  }

  util.inherits(DbEventEmitter, EventEmitter)
  var dbEventEmitter = new DbEventEmitter()

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~ MANEJADORES DE EVENTOS DE BASE DE DATOS  ~~~~~~~~~~~~~~~~~
  // **************************************************************************
  // **************************************************************************
  dbEventEmitter.on('nuevo_pedido_' + idEmpresa, (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return
    timer.restart()
    tmrProcesarEventosCapturados.restart()
    poner(arrEvtPedidos, msg)
  })

  dbEventEmitter.on('nuevo_pedido_item_' + idEmpresa, (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return
    tmrProcesarEventosCapturados.restart()
    poner(arrEvtItems, msg)
  })

  dbEventEmitter.on('nuevo_pedido_item_descuento_' + idEmpresa, (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return
    tmrProcesarEventosCapturados.restart()
    poner(arrEvtDescuentos, msg)
  })

  dbEventEmitter.on('pedido_eliminado_' + idEmpresa, (msg) => {
    if (! vendedores.includes(msg.idVendedor))
      return
    if (!arrEvtEliminados.includes(msg.id))
      arrEvtEliminados.push(msg.id)    
  });

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~ DEFINICION Y REGISTRO A LOS CANALES DE EVENTOS  ~~~~~~~~~~
  // **************************************************************************
  // **************************************************************************
  var client = Conexion.ConexionPG
  client.connect().then(err => {
    if (err) {
      log.fatal('No se puede escucharg')
    }
    log.info('Escuchando base de datos remota')
  })
  client.query('LISTEN nuevo_pedido_' + idEmpresa)
  client.query('LISTEN nuevo_pedido_item_' + idEmpresa)
  client.query('LISTEN nuevo_pedido_item_descuento_' + idEmpresa)
  client.query('LISTEN pedido_eliminado_' + idEmpresa)
  client.on('notification', function (msg) {
    let payload = JSON.parse(msg.payload)
    log.debug('Se emitio: ' + msg.channel)
    dbEventEmitter.emit(msg.channel, payload)
  })
  client.on('error', err => {
    log.fatal(`Se perdio la conexion.`)
});

  // SINCRONIZACION DE PEDIDOS
  // inicia la sincro de pedidos no descargados aun. Se ejecuta solo una vez al iniciar el proceso.
  async function sincronizarPedidos () {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."

    var pedidosParaInsertar = []
    var pedidosItemsParaInsertar = []
    var pedidosItemsDescuentosParaInsertar = []
    var eliminados = []
    var paraEliminar = {}
    var r = 0
    var idPedidosRemoto = []
    var eliminadosLocal = []
    var argFecha = process.argv.slice(2).shift();
    var fechaDesde
    var fechaDesdeLocal 

    // Si viene una fecha como argumento la tomo como fecha_desde para sincronizar pedidos
    // sino descargo los pedidos del dia.
    if (argFecha) {
      let d = argFecha.split(/\D+/)
      fechaDesde = new Date(Date.UTC(d[0], --d[1], d[2], d[3], d[4], d[5], d[6]))
      fechaDesdeLocal = new Date(Date.UTC(d[0], --d[1], d[2], d[3], d[4], d[5], d[6]))
    } else {
      let t = new Date()
      fechaDesde = new Date(new Date().setDate(new Date().getDate()-5))
      fechaDesdeLocal = new Date(new Date().setDate(new Date().getDate()-6))
    }
    
    // Query pedidos en local 
    var pedidosLocal = await Pedidos.findAll({
      attributes: ['id'],
      where: {
        iOrigen: 1,
        sOperador: 'NODESINCRO',
        idVendedor: {[Op.in]: vendedores},
        fPedido: {
          [Op.gte]: fechaDesdeLocal
        }
      }
    })

    var pedidosRemoto = await PgPedidos.findAll({
      where: {
        idVendedor: {[Op.in]: vendedores},
        idEmpresa: idEmpresa,
        fPedido: {
          [Op.gte]: fechaDesde
        }
      },
      order: [
        ['idPedido']
      ]
    })
    console.log('pedidos remoto')
    var localEliminados = await DmllogEliminados.findAll({
      attributes: ['id', 'sTabla'],
      where: {
        sTabla: {[Op.in]: ['PedidosItems', 'PedidosItemsDescuentos']},
        fEliminado: {
          [Op.gte]: fechaDesde
        }
      },
      limit: 10000
    })
    // Mapea formato de salida (array de ids)
    eliminados = _.map(pedidosRemoto, function(pedidosRemoto) { if (pedidosRemoto.DeletedOn != null) return pedidosRemoto.id })
    pedidosLocal = _.map(pedidosLocal, function(pedidosLocal) { return pedidosLocal.id.toLowerCase() })
    idPedidosRemoto = _.map(pedidosRemoto, function(pedidosRemoto) { return pedidosRemoto.id.toLowerCase() })
    eliminadosLocal = _.map(localEliminados, function(localEliminado) { return localEliminado.id })
    console.log('comparacion')
    try {
      var pedidosItemsLocal = await localDB.query('SELECT PIT.id FROM PedidosItems PIT, Pedidos P ' + 
                            'WHERE PIT.iOrigen=1 and P.idPedido=PIT.idPedido and P.idVendedor=PIT.idVendedor ' + 
                            `and P.iOrigen=PIT.iOrigen and P.fPedido>='${fechaDesdeLocal.toISOString().replace('Z', '')}'`, { model: PedidosItems })
      var pedidosItemsDescuentosLocal = await localDB.query('SELECT PITD.id FROM PedidosItemsDescuentos PITD, Pedidos P ' + 
                                      'WHERE PITD.iOrigen=1 and P.idPedido=PITD.idPedido and P.idVendedor=PITD.idVendedor ' + 
                                      `and P.iOrigen=1 and P.fPedido>='${fechaDesdeLocal.toISOString().replace('Z', '')}'`, { model: PedidosItemsDescuentos })
    } catch (e) {
      log.fatal(e.message)
      process.exit(1)
    }  
    console.log('pedidos iotems y descuentos local')                                                                  
    try {
      var pedidosItemsRemoto = await PgPedidosItems.findAll({
        where: {
          PedidoID: { [Op.in]: idPedidosRemoto },
          DeletedOn: null
        }
      })
      console.log('pedidos items remoto')
      var pedidosItemsDescuentosRemoto = await PgPedidosItemsDescuentos.findAll({
        where: {
          PedidoID: { [Op.in]: idPedidosRemoto },
          DeletedOn: null
        }
      })
      console.log('descuentos remoto')
    } catch (e) {
      log.fatal(e.message)
    }

    // Si los pedidos items se encuentran en tabla DMLLOG_ELIMINADOS se los omite
    pedidosItemsRemoto = _.map(pedidosItemsRemoto, function(p) { 
      if ( ! eliminadosLocal.includes(p.id.toUpperCase()) )
        return p
    })

    pedidosItemsDescuentosRemoto = _.map(pedidosItemsDescuentosRemoto, function(p) { 
      if ( ! eliminadosLocal.includes(p.id.toUpperCase()) )
        return p 
    })
    console.log('comparacion log eliminados')

    pedidosItemsLocal = _.map(pedidosItemsLocal, function(pedidosItemsLocal) { return pedidosItemsLocal.id.toLowerCase() })
    pedidosItemsDescuentosLocal = _.map(pedidosItemsDescuentosLocal, function(pedidosItemsDescuentosLocal) { 
      return pedidosItemsDescuentosLocal.id.toLowerCase() })

    pedidosParaInsertar = comparaRemotoLocal(pedidosRemoto, pedidosLocal, eliminados)
    pedidosItemsParaInsertar = comparaRemotoLocal(pedidosItemsRemoto, pedidosItemsLocal)
    pedidosItemsDescuentosParaInsertar = comparaRemotoLocal(pedidosItemsDescuentosRemoto, pedidosItemsDescuentosLocal)
    paraEliminar = getPedidosParaEliminar(pedidosLocal, eliminados)
    console.log('comparaciones')
    await cargaDeDatos(pedidosParaInsertar, pedidosItemsParaInsertar, pedidosItemsDescuentosParaInsertar)
    eliminarEliminadoEnMovil(paraEliminar)

    timer.restart()
  }

  // GESTIONA LOS INSERTS DE CADA TABLA
  async function cargaDeDatos(pedidosParaInsertar, pedidosItemsParaInsertar, pedidosItemsDescuentosParaInsertar) {
    lock = true
    var paraQuitar = await verificarDescuentosXItem(pedidosItemsParaInsertar, pedidosItemsDescuentosParaInsertar)
    var r = 0

    log.info(`Se encontraron: ${pedidosParaInsertar.length} Pedidos, ${pedidosItemsParaInsertar.length} Items y ${pedidosItemsDescuentosParaInsertar.length} ItemsDescuentos para descargar.`)
    
    if (paraQuitar.length > 0) log.info(`Descartando pedidos incompletos: ${paraQuitar}`)
    pedidosParaInsertar = pedidosParaInsertar.filter(p => { return !paraQuitar.includes(p.id) })
    pedidosItemsParaInsertar = pedidosItemsParaInsertar.filter(it => { return !paraQuitar.includes(it.PedidoID) })
    pedidosItemsDescuentosParaInsertar = pedidosItemsDescuentosParaInsertar.filter(d => { return !paraQuitar.includes(d.PedidoID) })

    arrActualizacionRefPedido = []
    arrRecalculoPedidos = []
    if (pedidosParaInsertar.length > 0) {
      r = await altaBDLocal(Pedidos, pedidosParaInsertar)
      log.info('Fin descarga pedidos. Registros afectados: ' + r)
    }
    if (pedidosItemsParaInsertar.length > 0) {
      r = await altaBDLocal(PedidosItems, pedidosItemsParaInsertar)
      log.info('Fin descarga pedidos Items. Registros afectados: ' + r)
    }
    if (pedidosItemsDescuentosParaInsertar.length > 0) {
      r= await altaBDLocal(PedidosItemsDescuentos, pedidosItemsDescuentosParaInsertar)
      log.info('Fin descarga pedidos Items Descuentos. Registros afectados: ' + r)
    }
    lock = false
    actualizarRefPedido(arrActualizacionRefPedido)
    actualizarLotesPedido(arrLotePedido)
    regenerarPedidosConPreciosActuales(arrRecalculoPedidos)
  }

  async function altaBDLocal (Modelo, queryset) {
    var idPedidoXVendedor = {}
    var r = 0

    for (var i in queryset) {
      if (queryset[i].tagModificado === 1) {
        r += await insertarEnTabla(Modelo, queryset[i])
        continue
      }
      if (Modelo.name == 'Pedidos'){
        var siguienteID
        if (idPedidoXVendedor[queryset[i].idVendedor] == undefined) {
          idPedidoXVendedor[queryset[i].idVendedor] = await getUltimoPedido(queryset[i].idVendedor)
        }
        siguienteID = idPedidoXVendedor[queryset[i].idVendedor] + 1
        idPedidoXVendedor[queryset[i].idVendedor] = siguienteID
        queryset[i].idPedido = siguienteID
      }
      if (['PedidosItems', 'PedidosItemsDescuentos'].includes(Modelo.name)){
        queryset[i].idPedido = await getPedidoPorPedidoID(queryset[i].PedidoID)
        if (queryset[i].idPedido == -1)
          queryset.splice(i, 1)
      }
      queryset[i].tagModificado = 1
      r += await agregarDatos(Modelo, queryset[i])
    }
    return r
  }

  async function agregarDatos (Modelo, reg) {
    var vendedor
    if (reg === undefined || reg === null)
      return 0
    if (reg.idVendedor !== undefined && reg.idVendedor !== null) { 
      vendedor = await getVendedor(reg.idVendedor)
    }
    if (Modelo.name == 'Pedidos'){
      reg.iOrigen = 1
      reg.sOperador = 'NODESINCRO'
      reg.sObserv = reg.sObservaciones
      reg.sComentario = reg.sObservaciones
      reg.idLotePedido = 1
      reg.rTotBruto = reg.totalPedido
      reg.rTotImpuestos = reg.totalImpuesto
      reg.rTotNeto = reg.totalNeto
      if (reg.fEntrega === undefined || reg.fEntrega === null) { reg.fEntrega = reg.fPedido }
      reg.fPedido = new Date(reg.fPedido).utc3().toISOString()
      reg.fEntrega = new Date(reg.fEntrega).utc3().toISOString()
      reg.idPV = vendedor.idPV
      reg.idSucursal = vendedor.idSucursal
      reg.bRemitado = 0
    }
    if (Modelo.name == 'PedidosItems'){
        reg.iOrigen = 1
        reg.idNumLinea = reg.idLinea
        reg.iCantidad = reg.nCantidad
        reg.rPrecio = reg.fPrecio
        reg.rDescuento = reg.rSubDescuento
        reg.rTotBruto = reg.fPrecio * reg.nCantidad
        reg.rTotNeto = (reg.fPrecio * reg.nCantidad) + reg.rSubDescuento + reg.rSubImpuesto
        reg.rImpuesto = reg.rSubImpuesto
        reg.bFacturado = 0
        reg.bPendiente = 1
        reg.iCantSub = 0
        reg.iCantUMxUnidad = 1
    }
    if (Modelo.name == 'PedidosItemsDescuentos'){
        reg.iOrigen = 1
        reg.idNumLinea = reg.idLinea
    }
    return await insertarEnTabla(Modelo, reg)
  }

  async function insertarEnTabla (Modelo, reg) {
    if (Modelo.name == 'Pedidos'){
      var existe = null
      try {
        existe = await Modelo.findOne({
                    attributes: ['id'],
                    where: {
                      idVendedor: reg.idVendedor,
                      iOrigen: 1,
                      id: reg.id
                    }
                  })
      } catch (err) {
        log.warn(err.message)
      }
      if (! existe) {
        return await Modelo.create(reg).then(nuevo => {
          log.info('Insertado pedido: ' + JSON.stringify(nuevo))
          clavePorIdPedido[nuevo.id] = nuevo.idPedido
          arrActualizacionRefPedido.push(nuevo)
          arrLotePedido.push({id: nuevo.id, idVendedor: nuevo.idVendedor})
          return 1
        }).catch(err => {
          log.warn(err.message)
          if (err.message.includes(('Violation of PRIMARY KEY constraint', 'conflicted with the FOREIGN KEY constraint')))
            arrEvtPedidos = arrEvtPedidos.filter(a => { return a.id != reg.id })
          return 0
        })
      } else {
        arrEvtPedidos = arrEvtPedidos.filter(a => { return a.id != reg.id })
        return 0
      }
    }
    else if (Modelo.name == 'PedidosItems'){
      if (reg.idPedido != -1){
        return await Modelo.create(reg).then(nuevo => {
          log.info('Insertado pedido item: ' + JSON.stringify(nuevo))
          return 1
        }).catch(err => {
          log.warn(err.message + ' ID: ' + reg.id)
          if (err.message.includes(('Violation of PRIMARY KEY constraint', 'conflicted with the FOREIGN KEY constraint')))
            arrEvtItems = arrEvtItems.filter(a => { return a.id != reg.id })
          return 0
        })
      }
    }
    else if (Modelo.name == 'PedidosItemsDescuentos'){
      if (reg.idPedido != -1){
        return await Modelo.create(reg).then(nuevo => {
          log.info('Insertado pedido item descuento: ' + JSON.stringify(nuevo))
          // REGENERAR 
          // Mando a regenerar pedido en la llegada de descuentos. Si ya esta regenerado omite el proceso
          if ( !pedidoEstaRegenerado(nuevo) )
            arrRecalculoPedidos.push(nuevo)
          return 1
        }).catch(err => {
          log.warn(err.message + ' ID: ' + reg.id)
          if (err.message.includes(('Violation of PRIMARY KEY constraint', 'conflicted with the FOREIGN KEY constraint')))
            arrEvtDescuentos = arrEvtDescuentos.filter(a => { return a.id != reg.id })
          return 0
        })
      }
    }
  }

  // Compara registros remoto contra local. Devuelve array con ids de registros no encontrados en local
  // Los query local como remoto deben tener obj.id como identificador de objeto
  function comparaRemotoLocal (remoto, local, eliminados = []) {
    var noEncontrados = []
    // Compara remoto con local. Los que no existen en local seran devueltos por la func
    if (eliminados.length > 0) {
      for (var i = 0; i < remoto.length; i++) {
        if (!local.includes(remoto[i].id) && !eliminados.includes(remoto[i].id) && 
            (remoto[i].idRefPedido == 0 || remoto[i].idRefPedido === null || remoto[i].idRefPedido === undefined)) {
          noEncontrados.push(remoto[i])
        }
      }
    }
    else {
      for (var i = 0; i < remoto.length; i++) {
        if (remoto[i] != undefined && !local.includes(remoto[i].id)) {
          noEncontrados.push(remoto[i])
        }
      }
    }
    return noEncontrados
  }

  function getPedidosParaEliminar (local, eliminados) {
    var paraEliminar = []

    // Compara local con eliminados. Si existe algunos seran eliminados de local (SI NO ESTA FACTURADO)
    for (var i = 0; i < eliminados.length; i++) {
      if (local.includes(eliminados[i])) {
        paraEliminar.push(eliminados[i])
      }
    }

    if (paraEliminar.length > 0) {
      log.info('Para eliminar. Pedidos IDs:')
      log.info(paraEliminar)
    }

    return paraEliminar
  }


  async function verificarInsertados(Modelo, arr) {
    var test
    var procesados = []
    for (var i = 0; i < arr.length; i++) {
      test = await Modelo.findAll({
        attributes: ['id'],
        where: {
          id: arr[i].id
        }
      })
      if (test.length) {
        procesados.push(arr[i].id)
      } else {
        if (arr[i].yaProcesado) {
          procesados.push(arr[i].id)
        } else {
          arr[i].yaProcesado = true
        }
      }
    }
    return procesados
  }

  function verificarDescuentosXItem(items, descuentos) {
    var itemDescuento = []
    var paraQuitar = []
    for (var i = 0; i < items.length; i++) {
      if ( paraQuitar.includes( items[i].PedidoID ) )
        continue;
      if ( items[i].rSubDescuento < 0 ) {
        itemDescuento = []
        itemDescuento = descuentos.filter(d => { return (d.PedidoID === items[i].PedidoID && d.idLinea === items[i].idLinea ) })
        if ( itemDescuento.length === 0 ){
          paraQuitar.push(items[i].PedidoID)
        }
      }
    }
    return paraQuitar
  }

  function pedidoEstaRegenerado (pedido) {
    var estaRegenerado = false
    for (var i = 0; i < arrRecalculoPedidos.length; i++) { 
      if ( arrRecalculoPedidos[i].idPedido === pedido.idPedido && arrRecalculoPedidos[i].idVendedor === pedido.idVendedor) {
        estaRegenerado = true
        break
      }
    }
    return estaRegenerado
  }


  async function getVendedor (idVendedor) {
    try {
      const vendedor = await Vendedores.findAll({
        attributes: ['idPV', 'idSucursal'],
        where: {
          idVendedor: idVendedor
        }
      });
      return vendedor.shift();
    }
    catch (e) {
      return null;
    }
  }

  async function getUltimoPedido (idVendedor) {
    try {
      const ultimo = await Pedidos.findAll({
        attributes: ['idPedido'],
        where: {
          idVendedor: idVendedor,
          iOrigen: 1
        },
        order: [
          [localDB.fn('max', localDB.col('idPedido')), 'DESC']
        ],
        limit: 1,
        group: ['idPedido']
      });
      if (ultimo[0] === undefined) {
        return 0;
      }
      else {
        return parseInt(ultimo[0].idPedido);
      }
    }
    catch (err) {
      return 1;
    }
  }

  async function getPedidoPorPedidoID (id) {
    if (clavePorIdPedido[id] != undefined) {
      return clavePorIdPedido[id] 
    }
    else {
      try {
        const pedido = await Pedidos.findAll({
          attributes: ['idPedido'],
          where: {
            id: id.toUpperCase()
          }
        });
        if (pedido !== undefined) {
          clavePorIdPedido[id] = pedido[0].idPedido
          return pedido[0].idPedido
        }
        else {
          return -1;
        }
      }
      catch (err) {
        return -1;
      }
    }
  }

  /**
   * Elimina los pedidos enviados como parametros en BD local
   * @param {array} elim - Array de ids de pedidos
   * @return {array} Array de objetos procesados.
   */
  async function eliminarEliminadoEnMovil (elim) {
    var procesados = []
    for (var i in elim) {
      var pedido
      var items
      var facturado = false
      try {
        pedido = await Pedidos.findOne({
          where: {
            id: elim[i]
          }
        })
        if (!pedido) {
          procesados.push(elim[i])
          continue
        } 
        items = await PedidosItems.findAll({
          where: {
            idPedido: pedido.idPedido,
            idVendedor: pedido.idVendedor,
            iOrigen: 1
          }
        })
      } catch (err) {
        log.fatal('No se pudo eliminar el pedido.')
        log.fatal(err.message)
        if (err.message.includes('Failed to connect to'))
            dbEventEmitter.emit('pedido_eliminado_' + idEmpresa, {id: elim[i]})
        continue
      }
      for (var j in items) {
        if (items[j].bPendiente == 0 || items[j].bFacturado == 1) { facturado = true }
      }
      if (!facturado) {
        let transaction
        try {
          transaction = await localDB.transaction() // Instancio la transaccion
          await PedidosItemsDescuentos.destroy({
            where: {
              idPedido: pedido.idPedido,
              idVendedor: pedido.idVendedor,
              iOrigen: 1
            }, transaction})
          await PedidosItems.destroy({
            where: {
              idPedido: pedido.idPedido,
              idVendedor: pedido.idVendedor,
              iOrigen: 1
            }, transaction})
          await Pedidos.destroy({
            where: {
              idPedido: pedido.idPedido,
              idVendedor: pedido.idVendedor,
              iOrigen: 1
            }, transaction})
          await transaction.commit() // Ejecuto transaccion
          log.info(`Pedido eliminado: ${elim[i]}`)
          procesados.push(elim[i])
        } catch (err) {
          log.fatal('No se pudo eliminar el pedido.')
          log.fatal(err.message)
          if (err.message.includes('Failed to connect to'))
            dbEventEmitter.emit('pedido_eliminado_' + idEmpresa, {id: elim[i]})
          if (err) await transaction.rollback()
        }
      } else { 
        procesados.push(elim[i])
        log.info('El pedido facturado no se eliminó: ' + JSON.stringify(pedido))        
      }
    }
    return procesados
  }

  // --X DEPRECADO X--
  function reestablecerEliminadoFacturado (pedido) {
    PgPedidos.update({
      sObservaciones: pedido.sObserv + ' [Imposible eliminar, pedido ya facturado]',  
      DeletedOn: null 
    }, { 
      where: { id: pedido.id }
    }).then(() => {
      PgPedidosItems.update({ 
        DeletedOn: null 
      }, { 
        where: { PedidoID: pedido.id }
      }).then(() => {
        PgPedidosItemsDescuentos.update({
          DeletedOn: null 
        }, { 
          where: { PedidoID: pedido.id }
        }).then(() => {
          log.info('Pedido reestablecido en el movil')
        }).catch(function (error) {
          log.fatal('No se pudo actualizar PedidosItemsDescuentos en el movil')
          log.fatal(error)
        })
      }).catch(function (error) {
        log.fatal('No se pudo actualizar PedidosItems en el movil')
        log.fatal(error)
      })
    }).catch(function (error) {
      log.fatal('No se pudo actualizar Pedido en el movil')
      log.fatal(error)
    })
  }

  async function actualizarRefPedido(arr) {
    for (let i=0; i < arr.length; i++) {
      await PgPedidos.update({idRefPedido: arr[i].idPedido},
                              { where: { id: arr[i].id } }
      ).catch(e =>
        log.warn(e.message)
      )
    }
  }

 async function getLotePedido(idVendedor) {
    var idLotePedido = -1
    var t = new Date()
    var today = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0).utc3()
    idLotePedido = await LotesPedido.findOne({
      attributes: ['idLotePedido'],
      where: {
        idVendedor: idVendedor,
        fLotePedido: today
      }
    })
    if (idLotePedido === null || idLotePedido === undefined) {
      await localDB.query(`INSERT INTO LotesPedido 
                          (idLotePedido, idSucursal, sObservaciones, fLotePedido, idVendedor) 
                          VALUES ((select MAX(idLotePedido)+1 from LotesPedido), 
                          (SELECT idSucursal FROM Vendedores where idVendedor=${idVendedor}), 
                          'Vendedor N ${idVendedor}. Descarga de NodeSincro ${today.getDate()+1}/${today.getMonth()+1}/${today.getFullYear()}', 
                          '${today.toISOString()}', ${idVendedor})`)
                          .then(async () => {
                            console.log('INSERTO LOTE')
                            idLotePedido = await LotesPedido.findOne({
                              attributes: ['idLotePedido'],
                              where: {
                                idVendedor: idVendedor,
                                fLotePedido: today
                              }
                            })
                            console.log(idLotePedido)
                            return idLotePedido.idLotePedido
                          })
                          .catch(e => {
                              log.warn(e)
                              return null
                          })
    }
    else
      return idLotePedido.idLotePedido
  }

  async function actualizarLotesPedido(arr) {
    var lotePedido = -1
    for (let i=0; i < arr.length; i++) {
      lotePedido = await getLotePedido(arr[i].idVendedor)
      if (lotePedido === undefined)
        lotePedido = await getLotePedido(arr[i].idVendedor)
      await Pedidos.update({idLotePedido: lotePedido},
                              { where: { id: arr[i].id } }
      ).catch(e =>
        log.warn(e.message)
      )
    }
  }

  // Para casos en donde llega un pedido con descuentos que no corresponden para la fecha del pedido
  // o llega con precios fuera de vigencia.
  function regenerarPedidosConPreciosActuales(arr) {
    for (let i=0; i < arr.length; i++) {
      // Ejecutar procedimiento de importacion
      localDB.query(`EXEC SP_RegenerarPedidosConPreciosActuales ${arr[i].idPedido}, 1, ${arr[i].idVendedor}, NULL`)
      .then(() => {
        log.info(`Regenerar Pedido: ${arr[i].idPedido} (${arr[i].idVendedor})`) 
      })
      .catch(e => {
        log.warn(e.message) 
      })
    }
  }

  // Ejecuta sincronizarPedidos cuando se establecen las dos conexiones (local y remota)
  waitUntil()
      .interval(500)
      .times(Infinity)
      .condition(function () {
        return (connLocal && connRemoto)
      })
      .done(function (result) {
        sincronizarPedidos()
      })
} // FIN MAIN

waitUntil()
.interval(500)
.times(Infinity)
.condition(function () {
  return (opts !== undefined)
})
.done(() => {
  main()
})
