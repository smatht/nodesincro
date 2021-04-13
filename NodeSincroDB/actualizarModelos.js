'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Conexion = require('./conexion')
var argv = require('minimist')(process.argv.slice(2))
var Sincronizar = require('./sincro').Sincronizar
const _ = require('underscore')

Date.prototype.utc3 = function() {    
  this.setTime(this.getTime() - (3*60*60*1000)); 
  return this;   
}

async function main () {
  var TABLAS = []
  var sincro = new Sincronizar()
  if (argv._.length)  
    TABLAS = argv._ // SE MANDA POR PARAMETROS SEPARADO POR ESPACIOS
  else {
    let t = await sincro.obtenerModelos()
    TABLAS = _.map(t, function(m) { return m.idTabla })
  }
  console.log(TABLAS)
  var t = new Date()
  var hoy = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0).utc3()
  for (var i in TABLAS) {
    try {
      sincro.actualizarModelo(TABLAS[i], hoy)
    } catch (e) {
      console.log(e.message)
    }
  }
  setTimeout(()=>{process.exit(0)}, 5000)
}

main()