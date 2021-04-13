# NODE SINCRO
Paquete de microservicios para sincronización de BD

### Pre instalación
Instalar GIT [https://git-scm.com/downloads]
Instalar NodeJs v8+ [https://nodejs.org/es/download/]

Generar SSH key [https://help.github.com/articles/connecting-to-github-with-ssh/]

### Instalación
Clonar repositorio git:

```sh
$ cd [path/to/project]
$ git clone git@bitbucket.org:smatht/nodesincrodb.git
$ cd nodesincrodb/NodeSincroDB/
```

Instalar dependencias

```sh
$ npm install
```

### Variables de entorno

Configurar variables de usuario:

| Variable | Descripcion |
| -------- | ----------- |
| NODESINCRO_HOSTNAME | Hostname o IP de la BD |
| NODESINCRO_USERNAME | Nombre de usuario de la BD |
| NODESINCRO_PASSWORD | Contraseña |
| NODESINCRO_DBNAME | Nombre de la BD |
| NODESINCRO_IDEMPRESA | Campo idEmpresa de tabla admin - Empresas |
| NODESINCRO_INSTANCIA | (Opcional) Nombre instancia SqlServer |
| NODESINCRO_IDSUCURSAL | (Opcional) ID de sucursal. Necesario si se quiere limitar vendedores de una sucursal |

### Poner en produccion
#### Opcion 1
*Usando libreria PM2:*
 
```sh
$ npm install pm2 -g
$ pm2 start ecosystem.config.js
```

#### Opcion 2
*Usando libreria node-windows:*

Instalar node-windows de manera global:

```sh
$ npm install -g node-windows
$ npm link node-windows
```