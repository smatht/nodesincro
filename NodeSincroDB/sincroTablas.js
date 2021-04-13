'use strict'

/**
 * USAR sequelize-auto PARA GENERAR LOS MODELOS DE POSTGRE
 * @install npm install -g sequelize-auto
 * @install npm install -g pg@6.4.2
 * @install npm install -g pg-hstore
 * @command sequelize-auto -o "./Documents/DEV/Nodesincro/NodeSincroDB/models/auto-remoto" -d arventas -h xxxxx.c5gteocgux4c.sa-east-1.rds.amazonaws.com -u arandusoft -p 5432 -x xxxx -e postgres -t "Bancos,Barrios,BilleterasVirtuales,Canales,CategoriaClientes,Clientes,CondPago,CondVenta,Cotizaciones,CuentasBanco,Depositos,DescXCliente,DescXLista,DescXProducto,DescXPV,DescXVendedor,Descuentos,Familias,GrupoFamilia,GrupoNumeracion,GruposCanalesXCliente,Lineas,Listas,Productos,ProductosXVendedor,Encuestas,ImpXCliente,ImpXLista,ImpXProducto,ImpXPV,Impuestos,ItemsLista,Localidades,Monedas,MotivosNoCompra,NumeracionDoc,Paises,Provincias,Rutas,Stock,Subcanales,Sucursales,TiposDoc,TiposLote,Unidades,Vendedores,Zonas,DocCuenta,ObjetivosPorVendedor,ObjetivosPorVendedorDetalle,Encuestas,PreguntasPorEncuesta,OpcionesPorPregunta,RespuestaPorPreguntas,ClientesPorEncuesta,TiposPedidosXTiposDoc" -a "./Documents/DEV/Nodesincro/NodeSincroDB/models/auto-remoto/additional.json"
 */

const _ = require('underscore')
const waitUntil = require('wait-until')
const Mkdirp = require('mkdirp')
const fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));
var Sincronizar = require('./sincro').Sincronizar
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
  var sincro = new Sincronizar(log, sinModelo, primeraSincro)
  await sincro.testConexion()

  if (argv._.length)  
    TABLAS = argv._ // SE MANDA POR PARAMETROS SEPARADO POR ESPACIOS
  else {
    let t = await sincro.obtenerModelos()
    TABLAS = _.map(t, function(m) { return m.idTabla })
  }

  // CONFIGURACION DE PARAMETROS
  var sinModelo = argv["sin-modelo"]
  var primeraSincro = argv["primera-sincro"]

  for (let i in TABLAS) {
    log.info(`Sincronizando tabla: ${TABLAS[i]}`)
    let r = await sincro.run(TABLAS[i])
    if(r.ok) {
      if(r.alta>0 || r.actualizado>0)
        log.info(`Se dieron de alta ${r.alta} registros y/o se modificaron ${r.actualizado} registros en la tabla ${TABLAS[i]}`)
      }
    else
      log.warn(`Error al sincronizar ${TABLAS[i]}: ${r.error}`)
  }

  setTimeout(() => {
    log.info('Terminado!')
    //setImmediate(()=>{process.exit(0)})
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
