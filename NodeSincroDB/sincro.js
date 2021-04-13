'use strict'

const util = require('util')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Conexion = require('./conexion')
const querys = require('./sincroQuerys.json')
const progress = require('cli-progress')
const pPreset = require('./barPreset.js')
// Inicializar Sequelize para conectar a la BD local
const idEmpresa = process.env.NODESINCRO_IDEMPRESA
const localDB = Conexion.ConexionLocal({})
const remoteDB = Conexion.ConexionRemota( { 
  dialectOptions: {
    encrypt: true,
    useUTC: false,
  },
  pool: {max : 5, min: 0},
  //timezone: '00:00'
} )
const { getModelos } = require('./utils')
// DEFINICION DE MODELOS REMOTOS
const Modelos = localDB.import("models/local/Modelos")
const Bancos = remoteDB.import("models/auto-remoto/Bancos")
const Barrios = remoteDB.import("models/auto-remoto/Barrios")
const BilleterasVirtuales = remoteDB.import("models/auto-remoto/BilleterasVirtuales")
const Canales = remoteDB.import("models/auto-remoto/Canales")
const CategoriaClientes = remoteDB.import("models/auto-remoto/CategoriaClientes")
const Clientes = remoteDB.import("models/auto-remoto/Clientes")
const CondPago = remoteDB.import("models/auto-remoto/CondPago")
const CondVenta = remoteDB.import("models/auto-remoto/CondVenta")
const Cotizaciones = remoteDB.import("models/auto-remoto/Cotizaciones")
const CuentasBanco = remoteDB.import("models/auto-remoto/CuentasBanco")
const Depositos = remoteDB.import("models/auto-remoto/Depositos")
const DescXCliente = remoteDB.import("models/auto-remoto/DescXCliente")
const DescXLista = remoteDB.import("models/auto-remoto/DescXLista")
const DescXProducto = remoteDB.import("models/auto-remoto/DescXProducto")
const DescXPV = remoteDB.import("models/auto-remoto/DescXPV")
const DescXVendedor = remoteDB.import("models/auto-remoto/DescXVendedor")
const Descuentos = remoteDB.import("models/auto-remoto/Descuentos")
const Familias = remoteDB.import("models/auto-remoto/Familias")
const GrupoFamilia = remoteDB.import("models/auto-remoto/GrupoFamilia")
const GrupoNumeracion = remoteDB.import("models/auto-remoto/GrupoNumeracion")
const GruposCanalesXCliente = remoteDB.import("models/auto-remoto/GruposCanalesXCliente")
const Lineas = remoteDB.import("models/auto-remoto/Lineas")
const Listas = remoteDB.import("models/auto-remoto/Listas")
const Productos = remoteDB.import("models/auto-remoto/Productos")
const ProductosXVendedor = remoteDB.import("models/auto-remoto/ProductosXVendedor")
const Encuestas = remoteDB.import("models/auto-remoto/Encuestas")
const ImpXCliente = remoteDB.import("models/auto-remoto/ImpXCliente")
const ImpXLista = remoteDB.import("models/auto-remoto/ImpXLista")
const ImpXProducto = remoteDB.import("models/auto-remoto/ImpXProducto")
const ImpXPV = remoteDB.import("models/auto-remoto/ImpXPV")
const Impuestos = remoteDB.import("models/auto-remoto/Impuestos")
const ItemsLista = remoteDB.import("models/auto-remoto/ItemsLista")
const Localidades = remoteDB.import("models/auto-remoto/Localidades")
const Monedas = remoteDB.import("models/auto-remoto/Monedas")
const MotivosNoCompra = remoteDB.import("models/auto-remoto/MotivosNoCompra")
const NumeracionDoc = remoteDB.import("models/auto-remoto/NumeracionDoc")
const Paises = remoteDB.import("models/auto-remoto/Paises")
const Provincias = remoteDB.import("models/auto-remoto/Provincias")
const Rutas = remoteDB.import("models/auto-remoto/Rutas")
const Stock = remoteDB.import("models/auto-remoto/Stock")
const Subcanales = remoteDB.import("models/auto-remoto/Subcanales")
const Sucursales = remoteDB.import("models/auto-remoto/Sucursales")
const TiposDoc = remoteDB.import("models/auto-remoto/TiposDoc")
const TiposLote = remoteDB.import("models/auto-remoto/TiposLote")
const Unidades = remoteDB.import("models/auto-remoto/Unidades")
const Vendedores = remoteDB.import("models/auto-remoto/Vendedores")
const Zonas = remoteDB.import("models/auto-remoto/Zonas")
const DocCuenta = remoteDB.import("models/auto-remoto/DocCuenta")
const ObjetivosPorVendedor = remoteDB.import("models/auto-remoto/ObjetivosPorVendedor")
const ObjetivosPorVendedorDetalle = remoteDB.import("models/auto-remoto/ObjetivosPorVendedorDetalle")
const PreguntasPorEncuesta = remoteDB.import("models/auto-remoto/PreguntasPorEncuesta")
const OpcionesPorPregunta = remoteDB.import("models/auto-remoto/OpcionesPorPregunta")
const RespuestaPorPreguntas = remoteDB.import("models/auto-remoto/RespuestaPorPreguntas")
const ClientesPorEncuesta = remoteDB.import("models/auto-remoto/ClientesPorEncuesta")
const TiposPedidosXTiposDoc = remoteDB.import("models/auto-remoto/TiposPedidosXTiposDoc")

Date.prototype.utc3 = function() {    
  this.setTime(this.getTime() - (3*60*60*1000))
  return this 
}

class Sincronizar {
  constructor (log, sm, ps) {
    this.sinModelo = sm
    this.primeraSincro = ps
    this.log = log
    this.idSucursal = process.env.NODESINCRO_IDSUCURSAL
  }

  async testConexion () {
    try {
      await localDB.authenticate()
      this.log.info('Conectado a base de datos local.')
      await remoteDB.authenticate()
      this.log.info('Conectado a base de datos remota.')
      return {ok: true}
    } catch (e) {
      throw e.message
    }
  }

  async obtenerModelos () {
    let modelos = await getModelos(Modelos)
    return modelos
  }

  actualizarModelo (tabla, hora) {
    let qryModelo = `UPDATE Modelos set UltimaModificacionDML='${hora.toISOString().substring(0,23)}' where idTabla='${tabla}'`
    try {
    localDB.query(qryModelo)
    } catch (e) {
      throw e
      //this.log.warn(`No se pudo actualizar Modelo de tabla ${tabla}`)
    }
  }

  async primeraSincro (localQry, tabla) {
    const bar = new progress.Bar({barsize: 50}, pPreset)
    bar.start(localQry.length, 0, {tabla})
    for (var i in localQry) {
      localQry[i].idEmpresa = idEmpresa
      if (localQry[i].bActivo)
        localQry[i].bActivo = 1
      else
        localQry[i].bActivo = 0
      try {
        await eval(tabla).create(localQry[i])
      } catch (e) {
      
      }
      bar.update(i)
    }
    bar.update(++i)
    bar.stop()
    return {ok: true}
  }

  async sincro (localQry, tabla) {
    let alta = 0
    let actualizado = 0
    if (localQry.length > 0) {
      const bar = new progress.Bar({barsize: 40}, pPreset)
      bar.start(localQry.length, 0, {tabla})
      for (var i in localQry) {
        let obj = await this.datosParaRemoto (localQry[i], tabla)      
        try {
          let insert = await eval(tabla).upsert(obj)
          if(insert)
            alta += 1
          else
          actualizado += 1
        } catch (e) {
          this.log.warn(e)
        }
        bar.update(i)
      }
      bar.update(++i)
      bar.stop()
    }
    return {
      ok: true,
      alta,
      actualizado
    }
  }

  async datosParaRemoto (ob, tabla) {
    var obj = Object.assign({}, ob) // Copio objeto para no modificar la referencia
    // cargo datos comunes
    obj.idEmpresa = idEmpresa
    obj = await this.boolToInt(obj)
    // obj.bActivo = ((obj.bActivo) ? 1 : 0)
    // cargo datos dependiendo de la tabla
    switch (tabla.toLowerCase()) {
      case 'doccuenta':
        // obj.sEstado = ((obj.sEstado) ? 1 : 0)
        break
      default:
        break
    }
    return obj
  }

  async boolToInt (ob) {
    var obj = Object.assign({}, ob)
    let entries = Object.entries(obj)
    for (let i in entries) {
      if (typeof entries[i][1] == 'boolean')
        obj[entries[i][0]] = ((entries[i][1]) ? 1 : 0)
    }
    return obj
  }

  async run (tabla) {
    let qry = ''
    let where = false
    const excluirConModelo = ['DocCuenta', 'ItemsLista', 'ImpXCliente', 'ImpXProducto']
    var timeStamp = new Date().utc3()
    var time
    var registrosAfectados = 0

    time = new Date()
    if (querys[tabla]) {
      qry = querys[tabla].query
      where = querys[tabla].where
    } else
      qry = `SELECT * FROM ${tabla}`

    if (!this.primeraSincro && !this.sinModelo && !excluirConModelo.includes(tabla)){
      if (where)
        qry += ' AND'
      else
        qry += ' WHERE'
      qry += ` ( ${tabla}.InsertedOn>=(SELECT min(UltimaModificacionDML) FROM Modelos where idTabla='${tabla}') 
        OR ${tabla}.UpdatedOn>=(SELECT min(UltimaModificacionDML) FROM Modelos where idTabla='${tabla}' ))  
        and (${tabla}.InsertedOn is not null or ${tabla}.UpdatedOn is not null)`
      if(tabla.toLowerCase()=='stock' && this.idSucursal)
        qry += ` AND idDeposito in ( select DISTINCT idDeposito from DepositoXPtoVta where idPV in (
                                    select idpv from PuntosVenta where idSucursal=${this.idSucursal} ))`
    }
    try {
      var localQry = await localDB.query(qry, { type: Sequelize.QueryTypes.SELECT})
    } catch (e) {
      return { result: {ok: false, error: e} }
    }
    var result
    if (this.primeraSincro) {
      result = await this.primeraSincro(localQry, tabla)
      if (result.ok)
        this.actualizarModelo(tabla, timeStamp)
    } else {
      result = await this.sincro(localQry, tabla)
      if (result.ok)
        this.actualizarModelo(tabla, timeStamp)
    }
    time = new Date()
    return result
  }
}



// async function run () {
//    console.log(`DESDE SINCRO SIN MODELO:  ${sinModelo}`)
// }

// function construir (sm) {
//   sinModelo = sm
// }

module.exports = {
  Sincronizar
}