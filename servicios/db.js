const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'enjoy'

    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
    // //port: process.env.DB_PORT, // Añade esta línea si tu base de datos no usa el puerto 3306
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,
    // connectTimeout: 30000 // Añade esta línea para un tiempo de espera de 30 segundos
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos MySQL establecida correctamente');
    connection.release();
});

const conectar = () => {
    return pool.promise();
}

const liberarConexion = (connection) => {
    connection.release();
}

module.exports = { conectar, liberarConexion };
