const promise = require('bluebird');

const options = {
    promiseLib: promise,
    query: (e) => {
        console.log('Consulta ejecutada:', e.query);
    }
};

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;

// **ESTO ES CRÍTICO - Configurar parsers de fecha CORRECTAMENTE**
types.setTypeParser(1114, function(stringValue) {
    // timestamp without timezone - asumir que está en hora local del servidor
    return stringValue;
});

types.setTypeParser(1184, function(stringValue) {
    // timestamp with timezone - ya incluye info de timezone
    return stringValue;
});

// Extraemos los valores de las variables de entorno inyectadas por Docker
// Si no existen (ej. corriendo localmente sin Docker), usa los valores por defecto
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || 5432;
const dbDatabase = process.env.DB_NAME || 'sistema_psicologia';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '123456';

// Construimos el string de conexión dinámicamente para mantener tu timezone
const dynamicConnectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}?options=-c%20timezone%3DAmerica/Mexico_City`;

// Configuración de la conexión CON timezone explícito
const dataBaseConfig = {
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
    user: dbUser,
    password: dbPassword,
    connectionString: 'postgres://postgres:123456@db:5432/sistema_psicologia?options=-c%20timezone%3DAmerica/Mexico_City'
};

const db = pgp(dataBaseConfig);

// Conexión y configuración de timezone
db.connect()
    .then(obj => {
        console.log('Conexión a la base de datos establecida correctamente');

        // **FORZAR timezone en esta sesión**
        return obj.none("SET TIME ZONE 'America/Mexico_City'");
    })
    .then(() => {
        console.log('Timezone configurado a America/Mexico_City');
        return db.one("SHOW timezone");
    })
    .then(result => {
        console.log('Timezone actual de PostgreSQL:', result.timezone);
    })
    .catch(error => {
        console.error('Error al conectar a la base de datos:', error);
    });

module.exports = db;