'use strict'

const progress = require('cli-progress')
const pPreset = require('./barPreset.js')
process.env.API_URL
const request = require('axios')

Date.prototype.utc3 = function() {    
  this.setTime(this.getTime() - (3*60*60*1000))
  return this 
}

class Api {
  constructor (config) {
    this.url = config.url_base
    this.username = config.auth.username
    this.password = config.auth.password
  }

  async authenticate () {
    try {
      let r = await request({
        method: 'get',
        url: `${this.url}/empresas`,
        auth: {
          username: this.username,
          password: this.password
        }
      })
      return r.status
    } catch (e) {
      return e.response.status
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
      this.log.warn(`No se pudo actualizar Modelo de tabla ${tabla}`)
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
      const bar = new progress.Bar({barsize: 50}, pPreset)
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
  Api
}