'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const express = require('express')
const app = express()


async function main () {
  const userName = process.env.NODESINCRO_USERNAME
  const password = process.env.NODESINCRO_PASSWORD
  const hostName = process.env.NODESINCRO_HOSTNAME
  const DbName = process.env.NODESINCRO_DBNAME
  const instanceName = process.env.NODESINCRO_INSTANCIA || ''
  const idEmpresa = process.env.NODESINCRO_IDEMPRESA
  const idSucursal = process.env.NODESINCRO_IDSUCURSAL || -1

  // Conexion a postgres
  const pgUserName = 'xxxx'
  const pgPassword = 'xxxx'
  const pgHostName = 'xxxx'
  const pgDbName = 'xxxx'

  var localDB = new Sequelize(DbName, userName, password, {
    dialect: 'mssql',
    host: hostName,
    port: 1433, // Default port
    logging: false, // disable logging; default: console.log
    operatorsAliases: Op,
    dialectOptions: {
      instanceName: instanceName, //pianezzola
      encrypt: false
    },
    query: {
      raw: true
    }
  })

  var remoteDB = new Sequelize(pgDbName, pgUserName, pgPassword, {
    dialect: 'postgres',
    host: pgHostName,
    port: 5432, // Default port
    logging: false, // disable logging; default: console.log
    operatorsAliases: Op,
    dialectOptions: {
      encrypt: true
    },
    query: {
      raw: true
    }
  })

  localDB
    .authenticate()
    .then(() => {
      console.log('Conectado a base de datos local.')
    })
    .catch(err => {
      console.log('No se puede conectar con base de datos local:', err)
      // process.exit(1)
    })

    remoteDB
    .authenticate()
    .then(() => {
      console.log('Conectado a base de datos remota.')
    })
    .catch(err => {
      console.log('No se puede conectar con base de datos remota:', err)
      // process.exit(1)
    })

    var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', "*");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');
      res.header('Access-Control-Request-Headers', 'Content-Type,x-requested-with');
      next();
    }
  
    app.use(allowCrossDomain);

    app.get("/actividad", async (req, res) => {
      var params = req.query
      var query = await formatearInformacion(await extraerInformacion(params))
      // var query = [
      //   {"sucursal": "Santiago", "idVendedor":44,"nombre":"ORIETA, ARIEL DARIO","pedidosRemoto":40,"pedidosLocal":40,"pagosLocal":6,"pagosRemoto":6,"documentosLocal":6,"documentosRemoto":6,"estado":"En ruta...","iestado": 1, "facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":48,"nombre":"VALDEZ, RAUL","pedidosRemoto":20,"pedidosLocal":20,"recibosLocal":6,"recibosRemoto":6,"pagosLocal":6,"pagosRemoto":6,"documentosLocal":6,"documentosRemoto":6,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"En ruta...","iestado": 1,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":47,"nombre":"CONCHA, DANIEL","pedidosRemoto":15,"pedidosLocal":15,"recibosLocal":0,"recibosRemoto":0,"pagosLocal":0,"pagosRemoto":0,"documentosLocal":0,"documentosRemoto":0,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"En ruta...","iestado": 1,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":1041,"nombre":"GEREZ, DANIEL F.","pedidosRemoto":30,"pedidosLocal":30,"recibosLocal":13,"recibosRemoto":13,"pagosLocal":16,"pagosRemoto":16,"documentosLocal":13,"documentosRemoto":13,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 3,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":3,"nombre":"LOPEZ, PABLO","pedidosRemoto":29,"pedidosLocal":29,"recibosLocal":4,"recibosRemoto":4,"pagosLocal":4,"pagosRemoto":4,"documentosLocal":4,"documentosRemoto":4,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 3,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":1008,"nombre":"VILLALBA, DAVID F.","pedidosRemoto":27,"pedidosLocal":27,"recibosLocal":9,"recibosRemoto":9,"pagosLocal":9,"pagosRemoto":9,"documentosLocal":9,"documentosRemoto":9,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 3,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":29,"nombre":"DOMENGE, ROBERTO","pedidosRemoto":25,"pedidosLocal":25,"recibosLocal":3,"recibosRemoto":3,"pagosLocal":3,"pagosRemoto":3,"documentosLocal":4,"documentosRemoto":4,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 2,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":30,"nombre":"SANCHEZ, ALFREDO","pedidosRemoto":24,"pedidosLocal":24,"recibosLocal":8,"recibosRemoto":8,"pagosLocal":8,"pagosRemoto":8,"documentosLocal":8,"documentosRemoto":8,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 2,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":1026,"nombre":"MANFREDI, JULIO CESAR F.","pedidosRemoto":34,"pedidosLocal":34,"recibosLocal":14,"recibosRemoto":14,"pagosLocal":20,"pagosRemoto":20,"documentosLocal":17,"documentosRemoto":17,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 3,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":8,"nombre":"ABALLAY, LORENA FABIANA","pedidosRemoto":23,"pedidosLocal":23,"recibosLocal":8,"recibosRemoto":8,"pagosLocal":8,"pagosRemoto":8,"documentosLocal":10,"documentosRemoto":10,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 3,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":12,"nombre":"CASTILLO, MARCELA PATRICIA","pedidosRemoto":12,"pedidosLocal":12,"recibosLocal":7,"recibosRemoto":7,"pagosLocal":7,"pagosRemoto":7,"documentosLocal":7,"documentosRemoto":7,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 2,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":25,"nombre":"OVEJERO, CLAUDIO","pedidosRemoto":18,"pedidosLocal":18,"recibosLocal":6,"recibosRemoto":6,"pagosLocal":6,"pagosRemoto":6,"documentosLocal":7,"documentosRemoto":7,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 2,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":1009,"nombre":"ACOSTA, LUCAS F.","pedidosRemoto":33,"pedidosLocal":33,"recibosLocal":13,"recibosRemoto":13,"pagosLocal":14,"pagosRemoto":14,"documentosLocal":13,"documentosRemoto":13,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 1,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":38,"nombre":"RODRIGUEZ, SOLEDAD","pedidosRemoto":15,"pedidosLocal":15,"recibosLocal":8,"recibosRemoto":8,"pagosLocal":8,"pagosRemoto":8,"documentosLocal":8,"documentosRemoto":8,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 1,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":5,"nombre":"ABDALA, JOSE ALEJANDRO","pedidosRemoto":13,"pedidosLocal":13,"recibosLocal":7,"recibosRemoto":7,"pagosLocal":9,"pagosRemoto":9,"documentosLocal":10,"documentosRemoto":10,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 1,"facturado":0},
      //   {"sucursal": "Santiago", "idVendedor":1024,"nombre":"CHAVEZ, DIEGO F","pedidosRemoto":24,"pedidosLocal":24,"recibosLocal":10,"recibosRemoto":10,"pagosLocal":10,"pagosRemoto":10,"documentosLocal":15,"documentosRemoto":15,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 4,"facturado":0},
      //   {"sucursal": "Concepcion", "idVendedor":1103,"nombre":"DE LA RIESTRA, EDUARDO F.","pedidosRemoto":15,"pedidosLocal":15,"recibosLocal":8,"recibosRemoto":8,"pagosLocal":8,"pagosRemoto":8,"documentosLocal":8,"documentosRemoto":8,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 1,"facturado":0},
      //   {"sucursal": "Concepcion", "idVendedor":1104,"nombre":"PORRAS, SEBASTIAN F","pedidosRemoto":13,"pedidosLocal":13,"recibosLocal":7,"recibosRemoto":7,"pagosLocal":9,"pagosRemoto":9,"documentosLocal":10,"documentosRemoto":10,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 1,"facturado":0},
      //   {"sucursal": "Concepcion", "idVendedor":1106,"nombre":"ALLENDE, DANIEL F","pedidosRemoto":24,"pedidosLocal":24,"recibosLocal":10,"recibosRemoto":10,"pagosLocal":10,"pagosRemoto":10,"documentosLocal":15,"documentosRemoto":15,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 4,"facturado":0},
      //   {"sucursal": "Frias", "idVendedor":9,"nombre":"CARABAJAL, JORGE","pedidosRemoto":24,"pedidosLocal":24,"recibosLocal":10,"recibosRemoto":10,"pagosLocal":10,"pagosRemoto":10,"documentosLocal":15,"documentosRemoto":15,"pedidosItemsLocal":0,"pedidosItemsRemoto":0,"pedidosItemsDescuentosLocal":0,"pedidosItemsDescuentosRemoto":0,"estado":"Rendido","iestado": 4,"facturado":0}
      // ]
      res.status(200).jsonp(query)
    })
    
    app.listen(3000, () => {
      console.log("Escuchando puerto ", 3000)
    })

  function getCantidad(obj) {
    try {
      return obj.cant
    } catch (e) {
      return 0
    }
  }

  Date.prototype.utc3 = function() { 
    var dt = new Date(this.valueOf())   
    dt.setTime(this.getTime() - (3*60*60*1000)); 
    return dt;   
  }

  async function verificarCargasCerradas(rows) {
    var cRows = rows.map(r => r)
    var t = new Date()
    var desde = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0).utc3()
    var hasta = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59).utc3()
    var sCargasCerradas = `select * from Cargas 
                      where iEstado in (4,5) and "fPreparacion" between '${desde.toISOString()}' and '${hasta.toISOString()}'`
    var qCargasCerradas = await localDB.query(sCargasCerradas, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })    
    var vendedores = cRows.map(r => {return r.idVendedor})
    qCargasCerradas.forEach(cr => {
      vendedores.forEach(v => {
        if (cr.sComentario.includes('VENDEDOR ' + v)){
          cRows.forEach(r => {
            if (r.idVendedor == v) {
              if (cr.iEstado == 5) {
                r.estado = 'Rendido'
                r.iestado = 3
              } else if (cr.iEstado == 4) {
                r.estado = 'En rendicion'
                r.iestado = 2
              }
            }
          })
        }
      })
    })
    return cRows
  }

  async function extraerInformacion(params) {
    var t = new Date()
    var desde, hasta, desdeL, hastaL 

    if (params.desde) {
      let d = params.desde.split(/\D+/)
      let h = params.hasta.split(/\D+/)
      desde = new Date(Date.UTC(d[0], --d[1], d[2], d[3], d[4], d[5], d[6]))
      hasta = new Date(Date.UTC(h[0], --h[1], h[2], h[3], h[4], h[5], h[6]))
      desdeL = new Date(Date.UTC(d[0], --d[1], d[2], d[3], d[4], d[5], d[6]))
      hastaL = new Date(Date.UTC(h[0], --h[1], h[2], h[3], h[4], h[5], h[6]))
    } else {
      desde = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0))
      hasta = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59, 999))
      desdeL = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0))
      hastaL = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), 23, 59, 59, 999))
    }
    console.log(desdeL)
    console.log(hastaL)
    // PARA REMOTO
    var selectFinDia = ''
    var fromFinDia = ''
    var whereFinDia = ` and "fPedido" between '${desde.toISOString().replace('Z', '')}' and '${hasta.toISOString().replace('Z', '')}' `
    var groupByFinDia = ''
    // PARA LOCAL
    var selectPedido = ''
    var fromPedido = ''
    var wherePedido = ` and "fPedido" between '${desdeL.toISOString().replace('Z', '')}' and '${hastaL.toISOString().replace('Z', '')}' `
    var groupByPedido = ''
    
    if (params.findia) {
      // PARA REMOTO
      selectFinDia = ', fd."InsertedOn" as desde, NOW() as hasta '
      fromFinDia = ', "FinDia" fd '
      whereFinDia = ` and fd."idVendedor"=p."idVendedor" and fd."idEmpresa"=${idEmpresa} 
                      and fd."InsertedOn" in (select fdd."InsertedOn" from "FinDia" fdd 
                                              where fdd."idEmpresa"=fd."idEmpresa" and fdd."idVendedor"=fd."idVendedor" 
                                              order by "InsertedOn" desc limit 1)
                      and "fPedido" between fd."InsertedOn" and NOW() `
      groupByFinDia = ', fd."InsertedOn" '
      // PARA LOCAL
      selectPedido = 'fd.fecha as desde, '
      fromPedido = ', ARV_FinDia fd '
      wherePedido = ` and fd.idVendedor=v.idVendedor  
                        and fd.fecha in (select TOP(1) fdd.fecha from ARV_FinDia fdd 
                                              where fdd.idVendedor=fd.idVendedor 
                                              order by fdd.fecha desc)
                      and fPedido between fd.fecha and '${hastaL.toISOString().replace('Z', '')}'`
      groupByPedido = ', fd.fecha '
    }
    
    var resumen = {}
    var sPedidosLocal = `select p."idVendedor", v."sApellido", v."sNombre", ${selectPedido}
                       isnull(count(p.idPedido), 0) as cant from "Pedidos" p, "Vendedores" v ${fromPedido}
                      where p."DeletedOn" is null and p."idVendedor"=v."idVendedor" 
                       and p.sOperador='nodesincro' ${wherePedido}
                      group by p."idVendedor", v."sApellido", v."sNombre"${groupByPedido} order by cant desc;`
    var sPedidosRemoto = `select p."idVendedor", v."sApellido", v."sNombre", 
                       COALESCE(count(p.*), 0)::INT as cant, s."sNombre" as sucursal${selectFinDia} from "Pedidos" p, "Vendedores" v, "Sucursales" s${fromFinDia}
                      where p."DeletedOn" is null and p."idVendedor"=v."idVendedor" and s."idSucursal"=v."idSucursal"
                       and p."idEmpresa"=${idEmpresa} and v."idEmpresa"=${idEmpresa} and s."idEmpresa"=${idEmpresa} 
                       ${whereFinDia} 
                      group by p."idVendedor", v."sApellido", v."sNombre", s."sNombre"${groupByFinDia} order by cant desc;`
    var sRecibosLocal = `select p."idVendedor", v."sApellido", v."sNombre",  count(distinct p.idRecibo) as cant
                        from INTERFAZ_RECIBOS p, "Vendedores" v 
                        where "fRecibo" between '${desdeL.toISOString().replace('Z', '')}' and '${hastaL.toISOString().replace('Z', '')}' 
                          and p."idVendedor"=v."idVendedor"
                        group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc`
    var sRecibosRemoto = `select p."idVendedor", v."sApellido", v."sNombre", COALESCE(count(p.*),0)::INT as cant 
                          from "Recibos" p, "Vendedores" v
                          where "fPago" between '${desde.toISOString().replace('Z', '')}' and '${hasta.toISOString().replace('Z', '')}' 
                          and p."idEmpresa"=${idEmpresa} and p."DeletedOn" is null 
                           and v."idEmpresa"=${idEmpresa} and p."idVendedor"=v."idVendedor"
                          group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc;`
    var sPagosLocal = `select p."idVendedor", v."sApellido", v."sNombre", ISNULL(count(p.Importacion_id),0) as cant,
                      MAX(Importacion_iEstado) as estado from INTERFAZ_RECIBOS p, "Vendedores" v
                      where "fRecibo" between '${desdeL.toISOString().replace('Z', '')}' and '${hastaL.toISOString().replace('Z', '')}' 
                        and p."idVendedor"=v."idVendedor"
                      group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc`
    var sPagosRemoto = `select p."idVendedor", v."sApellido", v."sNombre", COALESCE(count(p.*),0)::INT as cant 
                        from "RecibosDetalle" p, "Vendedores" v
                        where "fRecibo" between '${desde.toISOString().replace('Z', '')}' and '${hasta.toISOString().replace('Z', '')}' 
                        and p."idEmpresa"=${idEmpresa} and p."DeletedOn" is null 
                        and v."idEmpresa"=${idEmpresa} and p."idVendedor"=v."idVendedor"
                        group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc;`
    var sDocumentosLocal = `select p."idVendedor", v."sApellido", v."sNombre", ISNULL(count(p.Importacion_id),0) as cant,
                            MAX(Importacion_iEstado) as estado from INTERFAZ_PAGOS p, "Vendedores" v
                            where "fPago" between '${desdeL.toISOString().replace('Z', '')}' and '${hastaL.toISOString().replace('Z', '')}' 
                              and p."idVendedor"=v."idVendedor"
                            group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc`
    var sDocumentosRemoto = `select p."idVendedor", v."sApellido", v."sNombre", COALESCE(count(p.*),0)::INT as cant 
                            from "Pagos" p, "Vendedores" v
                            where "fPago" between '${desde.toISOString().replace('Z', '')}' and '${hasta.toISOString().replace('Z', '')}' 
                              and p."idEmpresa"=${idEmpresa} and p."DeletedOn" is null and p."idVendedor"=v."idVendedor"
                              and v."idEmpresa"=${idEmpresa}
                            group by p."idVendedor", v."sApellido", v."sNombre" order by "idVendedor" desc;`
    var sVentasLocal = `select ve."idVendedor", v."sApellido", v."sNombre", isnull(count(ve.idNumDoc), 0) as cant 
                        from "Ventas" ve, "Vendedores" v
                        where ve."idVendedor"=v."idVendedor" 
                         and "fDocumento" between '${desdeL.toISOString().replace('Z', '')}' and '${hastaL.toISOString().replace('Z', '')}' 
                        group by ve."idVendedor", v."sApellido", v."sNombre" 
                        order by cant desc;`
    
    var qPedidosLocal = await localDB.query(sPedidosLocal, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qPedidosRemoto = await remoteDB.query(sPedidosRemoto, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qRecibosLocal = await localDB.query(sRecibosLocal, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qRecibosRemoto = await remoteDB.query(sRecibosRemoto, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qPagosLocal = await localDB.query(sPagosLocal, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qPagosRemoto = await remoteDB.query(sPagosRemoto, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qDocumentosLocal = await localDB.query(sDocumentosLocal, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qDocumentosRemoto = await remoteDB.query(sDocumentosRemoto, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })
    var qVentasLocal = await localDB.query(sVentasLocal, {type: Sequelize.QueryTypes.SELECT}).catch(err => {
      console.log(err)
    })

    resumen.desde = desde
    resumen.hasta = hasta
    resumen.pedidosLocal = qPedidosLocal
    resumen.pedidosRemoto = qPedidosRemoto
    resumen.recibosLocal = qRecibosLocal
    resumen.recibosRemoto = qRecibosRemoto
    resumen.pagosLocal = qPagosLocal
    resumen.pagosRemoto = qPagosRemoto
    resumen.documentosLocal = qDocumentosLocal
    resumen.documentosRemoto = qDocumentosRemoto
    resumen.ventasLocal = qVentasLocal

    return resumen
  }

  async function formatearInformacion(obj) {
    var rows = []
    var pedidosLocal = obj.pedidosLocal
    var pedidosRemoto = obj.pedidosRemoto
    var recibosLocal = obj.recibosLocal
    var recibosRemoto = obj.recibosRemoto
    var pagosLocal = obj.pagosLocal
    var pagosRemoto = obj.pagosRemoto
    var documentosLocal = obj.documentosLocal
    var documentosRemoto = obj.documentosRemoto
    var ventasLocal = obj.ventasLocal

    pedidosRemoto.forEach(e => {
      var row = {}
      row.idVendedor = e.idVendedor
      row.nombre = e.sApellido + ', ' + e.sNombre
      row.pedidosRemoto = e.cant
      row.pedidosLocal = getCantidad(pedidosLocal.filter(p => p.idVendedor === e.idVendedor)[0])
      row.recibosLocal = getCantidad(recibosLocal.filter(r => r.idVendedor === e.idVendedor)[0])
      row.recibosRemoto = getCantidad(recibosRemoto.filter(r => r.idVendedor === e.idVendedor)[0])
      row.pagosLocal = getCantidad(pagosLocal.filter(p => p.idVendedor === e.idVendedor)[0])
      row.pagosRemoto = getCantidad(pagosRemoto.filter(p => p.idVendedor === e.idVendedor)[0])
      row.documentosLocal = getCantidad(documentosLocal.filter(d => d.idVendedor === e.idVendedor)[0])
      row.documentosRemoto = getCantidad(documentosRemoto.filter(d => d.idVendedor === e.idVendedor)[0])
      row.facturado = getCantidad(ventasLocal.filter(d => d.idVendedor === e.idVendedor)[0])
      row.sucursal = e.sucursal

      // ToDo
      row.pedidosItemsLocal = 0
      row.pedidosItemsRemoto = 0
      row.pedidosItemsDescuentosLocal = 0
      row.pedidosItemsDescuentosRemoto = 0
      row.estado = 'En ruta...'
      row.iestado = 1
      

      rows.push(row)
    })
    // rows.forEach(r => {
    //   if (getCantidad(pagosLocal.filter(p => p.idVendedor === r.idVendedor)[0]) > 0) {
    //     var estado = pagosLocal.filter(p => p.idVendedor === r.idVendedor)[0].estado
    //     if (estado === 1) {
    //       r.estado = 'En rendicion'
    //       r.iestado = 'rendicion'
    //     }
    //   }
    // })

    if (rows.length >= 1) 
      rows = await verificarCargasCerradas(rows)

    rows.sort((a, b) => {
      if (a.estado == b.estado && a.estado == 'En ruta...')
        return 0
      else if (a.estado == 'En ruta...')
        return -1
      else if (b.estado == 'En ruta...')
        return 1
      else if (a.estado == 'En rendicion')
        return -1
      else if (b.estado == 'En rendicion')
        return 1
      else
        return 0
    })
    return rows
  }

  // var print = await formatearInformacion(await extraerInformacion())
  // console.log(print)
}

main()