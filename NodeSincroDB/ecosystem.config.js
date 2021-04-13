module.exports = {
    apps : [
        {
            name        : "Descarga pedidos",
            script      : "./listenPedidos.js",
            watch       : false,
            restart_delay: 5000
        },
        {
            name       : "Descarga recibos",
            script     : "./listenRecibos.js",
            watch       : false,
            restart_delay: 5000
        },
        {
            name       : "Monitor eliminados",
            script     : "./monitorEliminados.js",
            watch       : false,
            restart_delay: 5000
        },
        {
            name       : "Descarga clientes",
            script     : "./listenClientes.js",
            watch       : false,
            restart_delay: 5000
        }
    ]
}