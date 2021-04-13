'use strict'

const _ = require('underscore')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const waitUntil = require('wait-until')
const Mkdirp = require('mkdirp')
const fs = require('fs')
const Conexion = require('./conexion')
const progress = require('cli-progress')
const pPreset = require('./barPreset.js')
const colors = require('colors');
const { table } = require('table');
var argv = require('minimist')(process.argv.slice(2))
var opts

Mkdirp('logs/', () => { 
})
Mkdirp('logs/hist/manual/', () => { 
})

const nameLogFile = 'descargaManual'

// Abre el archivo de log, si tiene mas de 25 lineas lo renombra para crear un nuevo archivo de log
let i;
let count = 0;
fs.createReadStream(`./logs/${nameLogFile}.log`)
  .on('error', e => {
    opts = {
      errorEventName:'error',
      logDirectory:'./logs',
      fileNamePattern:`${nameLogFile}.log`,
      timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
    }
  })
  .on('data', chunk => {
      for (i=0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
  })
  .on('end', () => {
    if (count > 25) {
      fs.rename(`./logs/${nameLogFile}.log`, `./logs/hist/manual/${nameLogFile}` + Date.now().toString() + '.log', (err) => {
        if (err) throw err;
        opts = {
          errorEventName:'error',
          logDirectory:'./logs',
          fileNamePattern:`${nameLogFile}.log`,
          timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
        }
      })
    }
    else {
      opts = {
        errorEventName:'error',
        logDirectory:'./logs',
        fileNamePattern:`${nameLogFile}.log`,
        timestampFormat:'DD-MM-YYYY HH:mm:ss.SSS'
      }
    }
  })

async function main () {
  const log = require('simple-node-logger').createRollingFileLogger( opts );
  const idEmpresa = process.env.NODESINCRO_IDEMPRESA
  const idSucursal = process.env.NODESINCRO_IDSUCURSAL || -1
  var vendedores = []
  var clavePorIdPedido = {}
  var seDescargoAlgo = false
  var arrRecalculoPedidos = []
  var arrLotePedido = []

  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal({})
  var remoteDB = Conexion.ConexionRemota( { pool: {max : 3, min: 0} } )

  await localDB.authenticate()
  await remoteDB.authenticate()

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

  if (argv._.length)  
    vendedores = argv._
  else
    vendedores = await obtenerVendedoresDeSucursal(idSucursal, Vendedores)

  for (let i in vendedores) {
      await sincronizarPedidos(vendedores[i])
  }
  console.log('')
  if (seDescargoAlgo)
    console.log('Pedidos incorporados.')
  else
    console.log('No hay datos para descargar.')
  console.log('Fin del proceso.-')
  setTimeout(() => {
    process.exit(0)
  }, 5000)






  /**
   * ***************************************
   * FUNCIONES PRINCIPALES
   * ***************************************
   */

   // SINCRONIZACION DE PEDIDOS
  // inicia la sincro de pedidos no descargados aun. Se ejecuta solo una vez al iniciar el proceso.
  async function sincronizarPedidos (idVendedor) {
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
    var cantidadRegistros = 0
    const bar = new progress.Bar({barsize: 50}, pPreset)
    
    var pedidosRemoto = await PgPedidos.findAll({
      where: {
        idVendedor: {[Op.eq]: idVendedor},
        idEmpresa: idEmpresa,
        DeletedOn: null,
        [Op.or]: [{idRefPedido: null}, {idRefPedido: 0}]
      },
      order: [
        ['idPedido']
      ]
    })

    // var localEliminados = await DmllogEliminados.findAll({
    //     attributes: ['id'],
    //     where: {
    //       sTabla: {[Op.in]: ['PedidosItems', 'PedidosItemsDescuentos']},
    //       bProcesado: 0,
    //       fEliminado: {
    //         [Op.gte]: fechaDesde
    //       }
    //     }
    //   })

    idPedidosRemoto = _.map(pedidosRemoto, function(pedidosRemoto) { return pedidosRemoto.id.toLowerCase() })

    try {
      var pedidosItemsRemoto = await PgPedidosItems.findAll({
        where: {
          PedidoID: { [Op.in]: idPedidosRemoto },
          DeletedOn: null
        }
      })
      var pedidosItemsDescuentosRemoto = await PgPedidosItemsDescuentos.findAll({
        where: {
          PedidoID: { [Op.in]: idPedidosRemoto },
          DeletedOn: null
        }
      })
    } catch (e) {
      log.fatal(e.message)
    }

    cantidadRegistros = pedidosRemoto.length + pedidosItemsRemoto.length + pedidosItemsDescuentosRemoto.length
    if (cantidadRegistros > 0) {
        console.log('')
        console.log('Descarga de datos...')
        bar.start(cantidadRegistros, 0, {tabla: `Vendedor ${idVendedor}:`})

        await cargaDeDatos(bar, pedidosRemoto, pedidosItemsRemoto, pedidosItemsDescuentosRemoto)
        // eliminarEliminadoEnMovil(paraEliminar)
    }
  }

  // GESTIONA LOS INSERTS DE CADA TABLA
  async function cargaDeDatos(bar, pedidosParaInsertar, pedidosItemsParaInsertar, pedidosItemsDescuentosParaInsertar) {
    var paraQuitar = await verificarDescuentosXItem(pedidosItemsParaInsertar, pedidosItemsDescuentosParaInsertar)
    var r = 0

    log.info(`Se encontraron: ${pedidosParaInsertar.length} Pedidos, ${pedidosItemsParaInsertar.length} Items y ${pedidosItemsDescuentosParaInsertar.length} ItemsDescuentos para descargar.`)
    
    if (paraQuitar.length > 0) log.info(`Descartando pedidos incompletos: ${paraQuitar}`)
    pedidosParaInsertar = pedidosParaInsertar.filter(p => { return !paraQuitar.includes(p.id) })
    pedidosItemsParaInsertar = pedidosItemsParaInsertar.filter(it => { return !paraQuitar.includes(it.PedidoID) })
    pedidosItemsDescuentosParaInsertar = pedidosItemsDescuentosParaInsertar.filter(d => { return !paraQuitar.includes(d.PedidoID) })

    if (pedidosParaInsertar.length > 0) {
      r = await altaBDLocal(bar, Pedidos, pedidosParaInsertar)
      log.info('Fin descarga pedidos. Registros afectados: ' + r)
    }
    if (pedidosItemsParaInsertar.length > 0) {
      r = await altaBDLocal(bar, PedidosItems, pedidosItemsParaInsertar)
      log.info('Fin descarga pedidos Items. Registros afectados: ' + r)
    }
    if (pedidosItemsDescuentosParaInsertar.length > 0) {
      r= await altaBDLocal(bar, PedidosItemsDescuentos, pedidosItemsDescuentosParaInsertar)
      log.info('Fin descarga pedidos Items Descuentos. Registros afectados: ' + r)
    }
    bar.stop()

    let Result = []
    let insertados = []
    let diferencia = 0
    let sDiferencia = []
    let output
    let config

    Result.push(['Pedidos', 'Items', 'Descuentos', 'Pagos', 'Documentos'])
    config = {
      columns: {
        0: {
          alignment: 'center'
        },
        1: {
          alignment: 'center'
        },
        2: {
          alignment: 'center'
        },
        3: {
          alignment: 'center'
        },
        4: {
          alignment: 'center'
        }
      }
    };

    let pedidosInsertados = pedidosParaInsertar.filter(p => { return p.insertado })
    insertados.push(`${pedidosInsertados.length.toString()} `+ 'ok'.bgGreen)
    diferencia = pedidosParaInsertar.length - pedidosInsertados.length
    if (diferencia > 0)
      sDiferencia.push(`${diferencia} ` + 'Err'.bgRed)
    else
      sDiferencia.push('-')

    let itemsInsertados = pedidosItemsParaInsertar.filter(p => { return p.insertado })
    insertados.push(`${itemsInsertados.length.toString()} ` + 'ok'.bgGreen)
    diferencia = pedidosItemsParaInsertar.length - itemsInsertados.length
    if (diferencia > 0)
      sDiferencia.push(`${diferencia} ` + 'Err'.bgRed)
    else
      sDiferencia.push('-')

    let descuentosInsertados = pedidosItemsDescuentosParaInsertar.filter(p => { return p.insertado })
    insertados.push(`${descuentosInsertados.length.toString()} `+ 'ok'.bgGreen)
    diferencia = pedidosItemsDescuentosParaInsertar.length - descuentosInsertados.length
    if (diferencia > 0)
      sDiferencia.push(`${diferencia} ` + 'Err'.bgRed)
    else
      sDiferencia.push('-')
    
    // Espacios en tabla reservados para PAGOS
    insertados.push('-')
    insertados.push('-')
    sDiferencia.push('-')
    sDiferencia.push('-')
    
    Result.push(insertados)
    Result.push(sDiferencia)
    output = table(Result,  config)
    console.log(output)

    actualizarRefPedido(pedidosParaInsertar)
    actualizarLotesPedido(arrLotePedido)
    regenerarPedidosConPreciosActuales(arrRecalculoPedidos)
  }

  async function altaBDLocal (bar, Modelo, queryset) {
    var idPedidoXVendedor = {}
    var r = 0

    for (var i in queryset) {
      if (Modelo.name == 'Pedidos'){
        var siguienteID
        if (idPedidoXVendedor[queryset[i].idVendedor] == undefined) {
          idPedidoXVendedor[queryset[i].idVendedor] = await getUltimoPedido(queryset[i].idVendedor)
        }
        siguienteID = idPedidoXVendedor[queryset[i].idVendedor] + 1
        idPedidoXVendedor[queryset[i].idVendedor] = siguienteID
        queryset[i].idPedido = siguienteID
      }
      if (Modelo.name == 'PedidosItems'){
        if (clavePorIdPedido[queryset[i].PedidoID] == undefined) {
          clavePorIdPedido[queryset[i].PedidoID] = await getPedidoPorPedidoID(queryset[i].PedidoID)
        }
        if (clavePorIdPedido[queryset[i].PedidoID] != -1)
          queryset[i].idPedido = clavePorIdPedido[queryset[i].PedidoID]
        else
          queryset.splice(i, 1)
      }
      if (Modelo.name == 'PedidosItemsDescuentos'){
        if (clavePorIdPedido[queryset[i].PedidoID] == undefined) {
          clavePorIdPedido[queryset[i].PedidoID] = await getPedidoPorPedidoID(queryset[i].PedidoID)
        }
        if (clavePorIdPedido[queryset[i].PedidoID] != -1)
          queryset[i].idPedido = clavePorIdPedido[queryset[i].PedidoID]
        else
          queryset.splice(i, 1)
      }
      r += await agregarDatos(Modelo, queryset[i])
      bar.increment()
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
          arrLotePedido.push({id: nuevo.id, idVendedor: nuevo.idVendedor})
          seDescargoAlgo = true
          reg.insertado = true
          return 1
        }).catch(err => {
          log.warn(err.message)
          return 0
        })
      } else {
        reg.existe = true
        reg.insertado = true
        return 0
      }
    }
    else if (Modelo.name == 'PedidosItems'){
      if (reg.idPedido != -1){
        return await Modelo.create(reg).then(nuevo => {
          log.info('Insertado pedido item: ' + JSON.stringify(nuevo))
          seDescargoAlgo = true
          reg.insertado = true
          return 1
        }).catch(err => {
          log.warn(err.message + ' ID: ' + reg.id)
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
          seDescargoAlgo = true
          reg.insertado = true
          return 1
        }).catch(err => {
          log.warn(err.message + ' ID: ' + reg.id)
          return 0
        })
      }
    }
  }

  async function obtenerVendedoresDeSucursal () {
    var where = {}
    if (idSucursal != -1) 
      where.idSucursal = idSucursal
    var vends = await Vendedores.findAll({
      attributes: ['idVendedor'],
      where: where
    })
    return _.map(vends, function(vend) { return vend.idVendedor })
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

  async function actualizarRefPedido(arr) {
    for (let i=0; i < arr.length; i++) {
      if (!arr[i].existe) {
        await PgPedidos.update({idRefPedido: arr[i].idPedido},
                                { where: { id: arr[i].id } }
        ).catch(e =>
          console.log(e.message)
        )
      } else {
        actualizarRefPedidoExistente(arr[i])
      }
    }
  }

  async function actualizarRefPedidoExistente(pedido) {
    let p = await Pedidos.findOne({
      attributes: ['idPedido'],
      where: {
        id: pedido.id
      }
    })
    if (p) {
      PgPedidos.update({idRefPedido: p.idPedido}, { where: { id: pedido.id } }
        ).catch(e => 
          console.log(e.message)
        )
    }
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
        console.log(e.message)
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
                          log.info('INSERTO LOTE: ' + idLotePedido)
                          idLotePedido = await LotesPedido.findOne({
                              attributes: ['idLotePedido'],
                              where: {
                              idVendedor: idVendedor,
                              fLotePedido: today
                              }
                          })                          
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
    try {
      const pedido = await Pedidos.findAll({
        attributes: ['idPedido'],
        where: {
          id: id.toUpperCase()
        }
      });
      if (pedido !== undefined) {
        return pedido[0].idPedido;
      }
      else {
        return -1;
      }
    }
    catch (err) {
      return -1;
    }
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
