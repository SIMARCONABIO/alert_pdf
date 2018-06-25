# README #

## Descripción ##

Está aplicación basada en NodeJS permite crear los PDF de alertas satelitales para el proyecto CONABIO-SIMAR.

## Instalación de aplicación ##

Clonar o descargar el reposotirio

```
git clone https://github.com/SIMARCONABIO/alert_pdf.git
```

## Configuración directorio ##

Crear un archivo de nombre .config.dir.js en el direction controller.

```javascript
const dir = "/some/awesome/directory"

module.exports = dir;
```


## Configuración base de datos ##

```javascript
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "user",
    port: "5432",
    password: "pass",
    database: "dbname"
  }
});

module.exports = knex;

```

## Ejecutar la aplicación ##

Para ejecutar la aplicación es necesario el siguiente comando.

```
node app
```

## Acceso a la aplicación ##

La aplicación hace referencia a la poligonales de las regiones cargadas en el proyecto SIMAR. El acceso a la aplicación es de la siguiente manera `http://[ip o url]:[puerto]/pdf/[anp]/[dd]/[mm]/[yyyy]`. Un ejemplo sería el siguiente:

http://simar.conabio.gob.mx:4001/pdf/05/01/01/2018

Qué realizará la consulta de la ANP 5 para la fecha 1 de enero de 2018.