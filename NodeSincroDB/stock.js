'use strict'

const Sequelizel = require('sequelize')

// Conexion a sqlserver
const localUserName = 'miuser'
const localPassword = 'CsSnIs22'
const localHostName = 'ticketserverr.database.windows.net'
const localDbName = 'BaseTicket'

// Conexion a postgres
const localUserName = 'xxxx'
const localPassword = 'xxxxx'
const localHostName = 'xxxxx.c5gteocgux4c.sa-east-1.rds.amazonaws.com'
const localDbName = 'xxxxx'

// Inicializar Sequelize para conectar a la BD local
var connLocal = new Sequelize(localDbName, localUserName, localPassword, {
  dialect: 'mssql',
  host: localHostName,
  port: 1433, // Default port
  logging: false, // disable logging; default: console.log
  dialectOptions: {
    encrypt: true,
    requestTimeout: 30000 // timeout = 30 seconds
  }
})