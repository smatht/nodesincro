'use strict'
/**
 * USAR sequelize-auto PARA GENERAR LOS MODELOS DE POSTGRE
 * @install npm install -g sequelize-auto
 * @install npm install -g pg@6.4.2
 * @install npm install -g pg-hstore
 * @command sequelize-auto -o "./Documents/DEV/Nodesincro/NodeSincroDB/models/auto-remoto" -d arventas -h xxxxx.c5gteocgux4c.sa-east-1.rds.amazonaws.com -u arandusoft -p 5432 -x xxxxx -e postgres -t "DocCuenta,Clientes,Stock,ItemsLista,Descuentos,DescXProducto,DescXCliente,DescXVendedor,DescXLista,DescXPV,ObjetivosPorVendedor,ObjetivosPorVendedorDetalle" -a "./Documents/DEV/Nodesincro/NodeSincroDB/models/auto-remoto/additional.json"
 */

const _ = require('underscore')
const waitUntil = require('wait-until')
const Mkdirp = require('mkdirp')
const fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));
const API = require('./api').Api
const BD = require('./bd').BD
const { getModelos } = require('./utils')
const API_USERNAME = 'xxx@xxxx' //process.env.API_USERNAME
const API_PASSWORD = 'xxxxxx' //process.env.API_PASSWORD
const API_URL = 'http://xxxxxxx.sa-east-1.compute.amazonaws.com/api' //
var opts

Mkdirp('logs/', function() { 
})
Mkdirp('logs/hist/sincro/', function() { 
})

const nameLogFile = 'sincroTablas' 

// Abre el archivo de log
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
    if (count > 1) {
      fs.rename(`./logs/${nameLogFile}.log`, `./logs/hist/sincro/${nameLogFile}` + Date.now().toString() + '.log', (err) => {
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
  var TABLAS = []
  // Configuro sincro
  var api = new API({
    url_base: API_URL,
    auth: {
      username: API_USERNAME,
      password: API_PASSWORD
    }
  })
  if (await api.authenticate() !== 200){
    log.fatal("Error de Autenticacion") 
    setImmediate( () => { process.exit(1) } )
  }
    
  var db = new DB({
    url_base: API_URL,
    auth: {
      username: API_USERNAME,
      password: API_PASSWORD
    }
  })

  try {
    await api.authenticate()
  } catch (e) {
    log.fatal("Error de Conexion base de datos local.") 
    setImmediate( () => { process.exit(1) } )
  }


  if (await db.authenticate() !== 200){
    console.log("Error de Autenticacion") 
    process.exit(1)
  }
    
  var bd = new BD()
  if (!await bd.authenticate()){
    console.log("Error de conexion base de dadtos local.") 
    process.exit(1)
  }
  

  if (argv._.length)  
    TABLAS = argv._ // SE MANDA POR PARAMETROS SEPARADO POR ESPACIOS
  else {
    //let t = await sincro.obtenerModelos()
  }

  // CONFIGURACION DE PARAMETROS
  var sinModelo = argv["sin-modelo"]
  var primeraSincro = argv["primera-sincro"]

  // for (let i in TABLAS) {
  //   log.info(`Sincronizando tabla: ${TABLAS[i].idTabla}`)
  //   let r = await sincro.run(TABLAS[i])
  //   if(r.ok) {
  //     if(r.alta>0 || r.actualizado>0)
  //       log.info(`Se dieron de alta ${r.alta} registros y/o se modificaron ${r.actualizado} registros en la tabla ${TABLAS[i]}`)
  //     }
  //   else
  //     log.warn(`Error al sincronizar ${TABLAS[i]}: ${r.error}`)
  // }

  setTimeout(() => {
    console.log('Terminado!')
    setImmediate(()=>{process.exit(0)})
  }, 5000)
}

waitUntil()
.interval(500)
.times(Infinity)
.condition(() => {
  return (opts !== undefined)
})
.done(() => {
  main()
})
