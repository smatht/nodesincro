'use strict'
/**
   * Paquete de conexion. 
   * Se utiliza para realizar conexion remota y local a bases de datos.
   * @author - Matias G. Sticchi
*/

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const pg = require('pg')

// Datos de conexion a BD local
const userName = process.env.NODESINCRO_USERNAME
const password = process.env.NODESINCRO_PASSWORD
const hostName = process.env.NODESINCRO_HOSTNAME
const DbName = process.env.NODESINCRO_DBNAME
const instanceDB = process.env.NODESINCRO_INSTANCIA || ''
// Conexion a postgres
const pgUserName = 'xxx'
const pgPassword = 'xxx'
const pgHostName = 'xxxx.c5gteocgux4c.sa-east-1.rds.amazonaws.com'
const pgDbName = 'xxxx'
// Host remotro
const stringConn = `tcp://${pgUserName}:${pgPassword}@${pgHostName}/${pgDbName}`

function ConexionLocal(opt) {
  let opts = {
    dialect: 'mssql',
    host: hostName,
    port: 1433, // Default port
    logging: false, // disable logging; default: console.log
    connectionTimeout: 30000,
    requestTimeout: 30000,
    operatorsAliases: Op,
    dialectOptions: {
      instanceName: instanceDB, 
      encrypt: false, 
      requestTimeout: 120000
    },
    query: {
      raw: true
    }
  }
  opts = Object.assign(opts, opt);

  return new Sequelize(DbName, userName, password, opts)
}

function ConexionRemota(opt) {
  let opts = {
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
  }
  opts = Object.assign(opts, opt);

  return new Sequelize(pgDbName, pgUserName, pgPassword, opts)
}

module.exports = {
    ConexionLocal,
    ConexionRemota,
    ConexionPG: new pg.Client(stringConn)
}