'use strict'
/**
   * Modulo con funciones utiles generales para sincro.
   * @author - Matias G. Sticchi
   * @param {callback} fn - Ejecuta el callback enviado como parametro.
   * @param {integer} t - Especifica el tienmpo del intervalo.
*/
const _ = require('underscore')

async function obtenerVendedoresDeSucursal (idSucursal, Vendedores) {
  var where = {}
  if (idSucursal != -1) 
    where.idSucursal = idSucursal
  var vends = await Vendedores.findAll({
    attributes: ['idVendedor'],
    where: where
  })
  return _.map(vends, function(vend) { return vend.idVendedor })
}

async function getModelos (Modelos) {
  var modelos = await Modelos.findAll({
    order: [
      ['iOrderSincro']
    ]
  })
  // return _.map(vends, function(vend) { return vend.idVendedor })
  return modelos
}

 module.exports = {
  obtenerVendedoresDeSucursal,
  getModelos
}