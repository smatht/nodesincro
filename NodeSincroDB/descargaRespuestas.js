'use strict'

/**
   * Microservicio de descarga de respuesta de encuestas. 
   * Mantiene una conexion persistente con postgresql y escucha los canales:
   *   - nueva_respuesta
   * @author - Matias G. Sticchi
*/

const EventEmitter = require('events')
const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const waitUntil = require('wait-until')
const Conexion = require('./conexion')
var argv = require('minimist')(process.argv.slice(2))
const Timer = require('./ARVTimer').Timer
var opts

Date.prototype.utc3 = function() {    
  this.setTime(this.getTime() - (3*60*60*1000))
  return this
}

main()

async function main () {
  const idEmpresa = process.env.NODESINCRO_IDEMPRESA
  const idSucursal = process.env.NODESINCRO_IDSUCURSAL || -1
  var localOpts = {}
  //var tmz = argv["tmz"]

  localOpts.timezone = '-03:00'
  // Inicializar Sequelize para conectar a la BD local
  var localDB = Conexion.ConexionLocal(localOpts)
  var remoteDB = Conexion.ConexionRemota( { pool: {max : 2, min: 0} } )

  const rRespuestaPorPreguntas = remoteDB.import("models/remoto/respuesta_por_preguntas")
  const lRespuestaPorPreguntas = localDB.import("models/local/respuesta_por_preguntas")

  try {
    await localDB.authenticate()
    await remoteDB.authenticate()
  } catch (e) {
    console.error(e.message)
    setTimeout(() => {
      process.exit(1)
    }, 10000)
  }

  sincronizar(2)

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~    DEFINICION Y REGISTRO AL CANAL DE EVENTOS     ~~~~~~~~~~
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
      console.error('No se puede Conectar A PG.')
    }
    console.log('Escuchando base de datos remota')
  })
  client.query('LISTEN nueva_respuesta_' + idEmpresa)
  client.on('notification', function (msg) {
    let payload = JSON.parse(msg.payload)
    dbEventEmitter.emit(msg.channel, payload)
  })

  // **************************************************************************
  // **************************************************************************
  //   ~~~~~~~~~~~ MANEJADORES DE EVENTOS DE BASE DE DATOS  ~~~~~~~~~~~~~~~~~
  // **************************************************************************
  // **************************************************************************
  dbEventEmitter.on('nueva_respuesta_' + idEmpresa, (msg) => {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."

    let carga = CargaDeDatos([msg])
    if (carga)
      console.log(`Respueta ingresada: ${msg.id}`)
  })


  /**
   * Instancia un timer que se usa para reiniciar el proceso cada cierto tiempo especificado 
   */
  var timer = new Timer(function() {
    console.log('Reinicio programado...')
    setImmediate(()=>{
      process.exit(0)
  });
  }, 43200000); // cada 12 hs...


  async function CargaDeDatos(respuestas) {
    let cantInsertada = 0
    for (let i in respuestas) {
      let insert = []
      try {
        respuestas[i].sDipositivo = ''
        if (! respuestas[i].sRespuesta)
          respuestas[i].sRespuesta = ''
        insert = await lRespuestaPorPreguntas.findOrCreate({
          where: {
            id: respuestas[i].id
          },
          defaults: respuestas[i] 
        })
      } catch(e) {
        console.error(`ERROR objeto: ${respuestas[i].id} ` + e.message)
      }
      if (insert[1])
        cantInsertada += 1
    }
    return cantInsertada
  }

   // SINCRONIZACION DE PEDIDOS
  // inicia la sincro de pedidos no descargados aun. Se ejecuta solo una vez al iniciar el proceso.
  async function sincronizar (diasAtras=1) {
    if (idEmpresa == undefined)
      throw "No se reconoce el id empresa."
    var fechaDesde = new Date(new Date().setDate(new Date().getDate()-diasAtras))
    
    var respuestas = await rRespuestaPorPreguntas.findAll({
      where: {
        idEmpresa: idEmpresa,
        DeletedOn: null,
        fTomaDeEncuesta: {
          [Op.gte]: fechaDesde
        }
      }
    })
    let insertados = await CargaDeDatos(respuestas)
    console.log(`Registros afectados: ${insertados}`)
  }
}
