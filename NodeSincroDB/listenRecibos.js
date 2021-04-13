'use strict'

/**
   * Microservicio de descarga de recibos (pagos). 
   * Cuando se inserta un registro de pago, la base de datos postgre emite un evento de notificacion \
   * el cual es "escuchado" por el modulo y procesa el dato procedente.
   * 
   * Mantiene una conexion persistente con postgresql y escucha los canales:
   *   - nuevo_recibo
   *   - nuevo_recibo_detalle
   *   - fin_dia
   * @author - Matias G. Sticchi
*/

const _ = require('underscore')
const pg = require('pg')
const EventEmitter = require('events')
const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
var waitUntil = require('wait-until')
var Mkdirp = require('mkdirp');
const fs = require('fs');
const Timer = require('./ARVTimer').Timer
const Conexion = require('./conexion')
const NodeLogger = require('simple-node-logger')
var opts

Mkdirp('logs/', function() { 
})
Mkdirp('logs/hist/recibos/', function() { 
})

const nameLogFile = 'descargaRecibos'

// Abre el archivo de log, si tiene mas de 500 lineas lo renombra para crear un nuevo archivo de log
let i;
let count = 0;
fs.createReadStream('./logs/descargaRecibos.log')
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
      fs.rename(`./logs/${nameLogFile}.log`, `./logs/hist/recibos/${nameLogFile}` + Date.now().toString() + '.log', (err) => {
        if (err) throw err;
        console.log('renamed complete');
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
    log.info('Iniciado.')
    var vendedores = []
    const idEmpresa = process.env.NODESINCRO_IDEMPRESA
    const idSucursal = process.env.NODESINCRO_IDSUCURSAL || -1
    var lockFinDia = false

    // Inicializar Sequelize para conectar a la BD local
    var localDB = Conexion.ConexionLocal({})
    var remoteDB = Conexion.ConexionRemota( { pool: {max : 3, min: 0} } )

    const RecibosDetalle = remoteDB.import("models/remoto/recibosDetalle")
    const Pagos = remoteDB.import("models/remoto/pagos")
    const FinDia = remoteDB.import("models/remoto/findia")
    const Vendedores = localDB.import("models/local/vendedores")

    // try {
    //   await localDB.authenticate()
    //   await remoteDB.authenticate()
    //   this.log.info('Conectado.')
    // } catch (e) {
    //   log.fatal('No se puede conectar con base de datos local:', e.message)
    //   setImmediate(()=> {process.exit(1)})
    // }

    // obtenerVendedoresDeSucursal()

    localDB
    .authenticate()
    .then(() => {
      obtenerVendedoresDeSucursal()
    })
    .catch(err => {
      log.error('No se puede conectar con base de datos local:', err)
      process.exit()
    })

    remoteDB
    .authenticate()
    .then(() => {})
    .catch(err => {
      log.error('No se puede conectar con base de datos remota:', err)
      process.exit()
    })
    
    const InterfazRecibos = localDB.import("models/local/interfaz_recibos")
    const InterfazPagos = localDB.import("models/local/interfaz_pagos")
    const localFinDia = localDB.import("models/local/finDia")

    var arrFinDia = []

    // Devuelve la fecha con tres horas menos. UTC -> UTC-3
    Date.prototype.utc3 = function() {    
      this.setTime(this.getTime() - (3*60*60*1000)); 
      return this;   
    }

    var timer = new Timer(function() {
      setImmediate(()=>{
        log.info('Reiniciando por timer...')
        process.exit(0)
    });
    }, 1200000);

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

  function actualizarDownloadedAt(tabla, obj) {
    var ahora = new Date()
    eval(tabla).update({DownloadedAt: ahora},
                        { where: { id: obj.id } }
    ).catch(e =>
      log.warn(e.message)
    )
  }

  function removeFinDia(arrFinDia, obj) {
    return arrFinDia.splice(arrFinDia.indexOf(obj), 1).shift()
  }

  // @Deprecado
  function updateInterfazPagosConRawQuery(pago) {
    // En algunos SQLSERVERs no se puede hacer update con el metodo normal del ORM,
    // entonces uso raw query.
    var rawQuery = `UPDATE [INTERFAZ_PAGOS] SET [Importacion_iEstado]=0
                    WHERE [idVendedor] = ${pago.idVendedor} AND [Importacion_iEstado] = -2;`
    return new Promise(resolve => {
      localDB.query(rawQuery).then(() => {
        resolve(true);
      })
      .catch(err => {
        log.warn(err.message)
        resolve(false);
      })
    })
  }

  // @Deprecado
  async function getIdRecibo(recibo) {
    var ult
    return InterfazRecibos.findAll({
      attributes: ['idRecibo'],
      where: {
        id: recibo.reciboid,
      },
      order: [
        [localDB.fn('max', localDB.col('idRecibo')), 'DESC']
      ],
      limit: 1,
      group: ['idRecibo']
    }).then(function (ultimo) {
      if (ultimo[0] === undefined) { 
        ult = getUltimoRecibo(recibo)
        return ult + 1
      } 
      else { 
        return parseInt(ultimo[0].idRecibo) 
      }
    })
    .catch(function (err) {
      return 1
    })
  }

  // @Deprecado
  async function getUltimoRecibo(recibo) {
    try {
      const ultimo = await InterfazRecibos.findAll({
        attributes: ['idRecibo'],
        where: {
          idVendedor: recibo.idVendedor,
        },
        order: [
          [localDB.fn('max', localDB.col('idRecibo')), 'DESC']
        ],
        limit: 1,
        group: ['idRecibo']
      });
      if (ultimo[0] === undefined) {
        return 0;
      }
      else {
        return parseInt(ultimo[0].idRecibo);
      }
    }
    catch (err) {
      return 1;
    }
  }
  
  function asentarFinDia (obj) {
    obj.fecha = new Date(obj.fecha).utc3().toISOString()
    localFinDia.create(obj)
      .then( () => { 
        log.info('Fin del dia registrado')
    })
    .catch( err => {
      log.warn('Error al registrar fin dia', err.message)
    })
  }

  function marcarLoteImportado (obj, estado) {
    var iEstado = 0

    if (estado) 
      iEstado = 2
    else
      iEstado = -1

    FinDia.update({iEstado: iEstado},
                   { where: { id: obj.id } }
      ).then(() => { 
        log.info('Se actualizo FinDia en remoto')
      }).catch(e => { 
        log.warn('No se actualizo FinDia en remoto')
      })
  }

  // Build and instantiate our custom event emitter
  function DbEventEmitter () {
      EventEmitter.call(this)
  }

  util.inherits(DbEventEmitter, EventEmitter)
  var dbEventEmitter = new DbEventEmitter()

  dbEventEmitter.on('nuevo_recibo_detalle_' + idEmpresa, (msg) => {
    timer.restart()
  })

  dbEventEmitter.on('nuevo_pago_' + idEmpresa, (msg) => {
    timer.restart()
  })

  dbEventEmitter.on('findia_' + idEmpresa, (msg) => {
    timer.restart()
    if (idEmpresa == undefined)
          throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return
    log.info('FIN DIA: ' + JSON.stringify(msg))
    var existeFinDia = arrFinDia.filter(fd => { return fd.idVendedor == msg.idVendedor })
    if (existeFinDia.length == 0) {
      arrFinDia.push(msg)
      procesarFinDia(msg)
    }
  })
  
  async function procesarFinDia(msg) {
    var errorLecturaRemoto = false
    if (idEmpresa == undefined)
            throw "No se reconoce el id empresa."
    if (! vendedores.includes(msg.idVendedor))
      return

    // VERIFICAR SI LA FUNCION ESTA BLOQUEADA PORQUE HAY UNA EJECUCION ACTIVA
    if (lockFinDia) {
      if (msg.locked && msg.locked < 50) {
        msg.locked += 1
      } else {
        if (msg.locked) {
          log.warn('Fin dia fueza desbloqueo...')
          lockFinDia = false
          msg.locked = 1
        } else {
          msg.locked = 1
        }
      }
      log.warn('Fin dia bloqueado')
      setTimeout(() => {
        procesarFinDia(msg)
      }, 1000)
    } else {
      // FUNCION NO BLOQUEADA - SE PROCEDE A BLOQUEAR
      lockFinDia = true
      // Query Interfaz_recibos en remoto
      try {
        var recibosRemoto = await RecibosDetalle.findAll({
        where: {
          idEmpresa: idEmpresa,
          idVendedor: msg.idVendedor,
          DeletedOn: null,
          fRecibo: { [Op.between]: [msg.fDesde, msg.fHasta] }
        }
        })
        // Query Interfaz_recibos en remoto
        var pagosRemoto = await Pagos.findAll({
          where: {
            idEmpresa: idEmpresa,
            idVendedor: msg.idVendedor,
            DeletedOn: null,
            fPago: { [Op.between]: [msg.fDesde, msg.fHasta] }
          }
        })
      } catch (e) {
        log.fatal(e.message)
        lockFinDia = false
        errorLecturaRemoto = true
      }
      if (!errorLecturaRemoto && ((recibosRemoto.length == msg.iCantRecibos && pagosRemoto.length == msg.iCantPagos && msg.iCantRecibos && msg.iCantPagos) || msg.tagProcesado)) {
        try {
          await insertarDatos(recibosRemoto, pagosRemoto)
        } catch(e) {
          log.error('Error inesperado al intentar insertar recibos / pagos. ' + e.message)
          lockFinDia = false
          removeFinDia(arrFinDia, msg)
        }
        // Se ingresaron recibos y pagos correctamente
        localDB.query('EXEC SP_IMPORTAR_LOTE_PALM 1')
              .then(importacion => {
                log.info('Resumen importacion lote:' + JSON.stringify(importacion, null, 2)) 
                lockFinDia = false
                marcarLoteImportado(msg, true);
                asentarFinDia (msg)
                removeFinDia(arrFinDia, msg)
                timer.restart()
              })
              .catch(e => {
                marcarLoteImportado(msg, false)
                removeFinDia(arrFinDia, msg)
                lockFinDia = false
                log.error(e) 
              })
      } else {
        lockFinDia = false
        if (msg.iCantRecibos && msg.iCantPagos && !errorLecturaRemoto) {
          log.warn('No coinciden cantidades informadas en Fin de dia')
          if (!msg.tagProcesado){
            msg.tagProcesado = 1
            setTimeout(() => {
              procesarFinDia(msg)
            }, 35000)
          } else {
              marcarLoteImportado(msg, false);
              removeFinDia(arrFinDia, msg)
          }
        } else {
          marcarLoteImportado(msg, true);
          removeFinDia(arrFinDia, msg)
        }
      }
    }
  }

  async function insertarDatos(recibos, pagos) {
    // *************************************************************************************
    // RECORRO ARRAY RECIBOS Y VOY INSERTANDO LOS DATOS
    // **********************************************************************************
    for (let i in recibos) {
    // Busca el recibo para que no existan duplicados
    let existe = await InterfazRecibos.findOne({
      where: {
        uuid: recibos[i].id
      }
    })
      // Si no encuentra el recibo ...
      if (!existe) { 
        // Formateo el objeto
        if (recibos[i].idImpuestoRetencion == null)  
        recibos[i].idImpuestoRetencion = 0
        if (recibos[i].idTransferenciaBanco == null)
          recibos[i].idTransferenciaBanco = 0
        if (recibos[i].idImpuestoRetencion == null)
          recibos[i].idDepositoBanco = 0
        if (recibos[i].bAnulado)
          recibos[i].bAnulado = 1
        else
          recibos[i].bAnulado = 0
        if (typeof recibos[i].fCarga == 'object') {
          recibos[i].fCarga = recibos[i].fCarga.toISOString()
          recibos[i].fRecibo = recibos[i].fRecibo.toISOString().substring(0,10)
        } else {
          recibos[i].fCarga = recibos[i].fCarga
          recibos[i].fRecibo = recibos[i].fRecibo.substring(0,10)
        }
        if (recibos[i].sNumCheque == null)
          recibos[i].sNumCheque = ''
        if (recibos[i].sNumTransferencia == null)
          recibos[i].sNumTransferencia = ''
        if (recibos[i].sNumeroCuenta == null)
          recibos[i].sNumeroCuenta = ''
        if (recibos[i].idRefTipoDoc == null)
          recibos[i].idRefTipoDoc = ''
        if (recibos[i].idTipoDoc == null)
          recibos[i].idTipoDoc = ''

        var InsertInterfazRecibos = `INSERT INTO INTERFAZ_RECIBOS ([idRecibo],[iLinea],
          [rImpRecibo],[fRecibo],[idCliente],[idMoneda],[fCarga],[rDisponible],
          [rCambio],[bAnulado],[idMonedaReferencia],[rCambioReferencia],
          [iTipo],[cImporte],[idBanco],[sNumCheque],[idTarjeta],[sNumeroCuenta],
          [idLoteCupon],[idCupon],[idClienteRetencion],[idPVRetencion],
          [idNumDocRetencion],[idImpuestoRetencion],[idTransferenciaBanco],
          [idTipoDoc],[idProveedor],[idNumDoc],[idDepositoBanco],[Importacion_iEstado],
          [idVendedor],[idRefTipoDoc],[idRefPV],[idRefNumDoc],[sNumTransferencia],[id],[uuid],[uuidRecibo]) 
          VALUES (ISNULL((select TOP(1) idRecibo from INTERFAZ_RECIBOS where uuidRecibo='${recibos[i].reciboid}'), 
          (select ISNULL(MAX(idRecibo)+1, 1) from INTERFAZ_RECIBOS where idVendedor=${recibos[i].idVendedor})),
          ${recibos[i].iLinea},${recibos[i].rImpRecibo},'${recibos[i].fRecibo}',${recibos[i].idCliente},${recibos[i].idMoneda},
          '${recibos[i].fCarga}',${recibos[i].rDisponible},1,${recibos[i].bAnulado},
          ${recibos[i].idMonedaReferencia},${recibos[i].rCambioReferencia},${recibos[i].iTipo},${recibos[i].cImporte},
          ${recibos[i].idBanco},'${recibos[i].sNumCheque}',${recibos[i].idTarjeta},'${recibos[i].sNumeroCuenta}',
          ${recibos[i].idLoteCupon},${recibos[i].idCupon},${recibos[i].idClienteRetencion},${recibos[i].idPvRetencion},
          ${recibos[i].idNumDocRetencion},${recibos[i].idImpuestoRetencion},${recibos[i].idTransferenciaBanco},
          '${recibos[i].idTipoDoc}',${recibos[i].idProveedor},${recibos[i].idNumDoc},${recibos[i].idDepositoBanco}
          ,0,${recibos[i].idVendedor},'${recibos[i].idRefTipoDoc}',${recibos[i].idRefPv},${recibos[i].idRefNumDoc},
          '${recibos[i].sNumTransferencia}', '${recibos[i].id}', '${recibos[i].id}', '${recibos[i].reciboid}')`
        try {    
          await localDB.query(InsertInterfazRecibos)
          log.info('Recibo ingresado ID:' + recibos[i].id)
          actualizarDownloadedAt('RecibosDetalle', recibos[i])
          // timer.restart()
        } catch(e) {
          throw {message: `No se pudo ingresar el pago: ${recibos[i].id}`}
        }
      } else {
        // recibos.splice(i, 1) // Ya esta guardado, lo elimino del array
      }
    } // fin FOR RECIBOS

    // *************************************************************************************
    // RECORRO ARRAY PAGOS Y VOY INSERTANDO LOS DATOS
    // **********************************************************************************
    for (let i in pagos) {
      if (typeof pagos[i].fPago == 'object') {
        pagos[i].fPago = pagos[i].fPago.toISOString()
      }
      let existe = await InterfazPagos.findOne({
        where: {
          id: pagos[i].id
        }
      })
      if (!existe) { 
        let idR = await InterfazRecibos.findOne({
          attributes: ['idRecibo'],
          where: {
            uuidRecibo: pagos[i].reciboID,
          },
          limit: 1
        })
        if (idR) {     
          var InsertInterfazPagos = `INSERT INTO INTERFAZ_PAGOS ([iPago],[idTipoDoc],
            [idPV],[idNumDoc],[iCuota],[fPago],[iOrigen],[rPagoCuota],
            [idRecibo],[idTipoDocNC],[idPVNC],[idNumDocNC],
            [idCliente],[idMoneda],[rCambio],[idVendedor],[Importacion_iEstado],[Importacion_sErrMsg],
            [id],[reciboID])  
            VALUES (1,'${pagos[i].idTipoDoc}', ${pagos[i].idPV},${pagos[i].idNumDoc},1,'${pagos[i].fPago.substring(0,10)}',1,${pagos[i].rPagoCuota},
              ${idR.idRecibo}, null, null, null, ${pagos[i].idCliente}, ${pagos[i].idMoneda}, 1,
              ${pagos[i].idVendedor}, 0, null, '${pagos[i].id}', '${pagos[i].reciboID}')`
          try {
            await localDB.query(InsertInterfazPagos)
            log.info('Pago ingresado ID:' + pagos[i].id) 
            actualizarDownloadedAt('Pagos', pagos[i])
              // timer.restart()
          } catch(e) {
            throw {message: `No se pudo ingresar el pago: ${pagos[i].id}`}
          }
        } else {
          throw {message: `No existe recibo asociado al pago: ${pagos[i].id}`}
        }
      } else {
        // pagos.splice(i, 1) // Ya esta guardado, lo elimino del array
      }
    } // fin FOR PAGOS
  } // fin FUNC

  var client = Conexion.ConexionPG
  if (idEmpresa == undefined)
          throw "No se reconoce el id empresa."
  client.connect().then(() => {
    // log.info('Escuchando base de datos remota')
  }).catch(e => {
    log.fatal(e.message)
  })
  client.query('LISTEN nuevo_recibo_detalle_' + idEmpresa)
  client.query('LISTEN nuevo_pago_' + idEmpresa)
  client.query('LISTEN findia_' + idEmpresa)
  client.on('notification', function (msg) {
    let payload = JSON.parse(msg.payload)
    log.debug('Se emitio: ' + msg.channel)
    dbEventEmitter.emit(msg.channel, payload)
  })
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
