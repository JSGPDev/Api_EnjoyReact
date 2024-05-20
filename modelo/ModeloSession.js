const bcrypt = require('bcrypt');
const db = require("../servicios/db");
const enviarCorreo = require("../servicios/mailer");

const saltos = 10;

let temp = {};

const limpiarTemp = (tiempo) => {
    setTimeout(() => {
        temp = {};
    }, tiempo);
};

const eliminarTemp = () => {
    temp = {};
}

class Session {
    async check_correo(correo, contrasenia) {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(`SELECT * FROM usuario WHERE correoUsuario = ?`, [correo]);

            if (results.length > 0 && await bcrypt.compare(contrasenia, results[0].contraseniaUsuario)) {
                return { correcto: true, error: null };
            } else {
                return { correcto: false, error: "correo y/o contraseña incorrectos" };
            }
        } catch (error) {
            throw error;
        }
    }

    async enviar_codigo_verif(nombre, correo, contrasenia, existe) {
        const conexion = await db.conectar();
        const [results] = await conexion.query(`SELECT * FROM usuario WHERE correoUsuario = ?`, [correo]);


        if (results.length == 0 || existe) {
            const codigo = Math.floor(100000 + Math.random() * 900000);
            const mensajeCorreo = `
            <h1>Código de Verificación</h1>
            <p>¡Hola!</p>
            <p>Este es tu código de verificación:</p>
            <h2>${codigo}</h2>
            <p>Por favor, utiliza este código para completar el proceso de verificación.</p>
            <p>Si no has solicitado este código, puedes ignorar este mensaje.</p>
            <p>Saludos,</p>
            <p>Enjoy Your Pet</p>
            `;
            temp = {
                [correo]: {
                    "nombre": nombre || NaN,
                    "contrasenia": contrasenia || NaN,
                    "codigo": codigo
                }
            }
            limpiarTemp(300000);
            try {
                await enviarCorreo(correo, "Código de Verificación", mensajeCorreo);
                return { correcto: true, error: null }
            } catch (error) {
                throw error;
            }
        } else {
            return { correcto: false, error: "el correo ya esta registrado" }
        }
    }

    async check_codigo_verif(correo, codigo) {
        console.log(temp[correo].codigo);
        if (temp[correo] && temp[correo].codigo === codigo) {
            try {
                const conexion = await db.conectar();
                const contrasenia = await bcrypt.hash(temp[correo].contrasenia, saltos); // Esperar a que se resuelva la promesa de hash
                const nombre = temp[correo].nombre;
                const [results, _] = await conexion.query(`INSERT INTO usuario (correoUsuario, contraseniaUsuario,nombreUsuario) VALUES (?,?,?)`, [correo, contrasenia, nombre]);

                if (results && results.affectedRows === 1) {
                    eliminarTemp();
                    return { correcto: true, error: null };
                } else {
                    return { correcto: false, error: "Error al insertar en la base de datos" };
                }
            } catch (error) {
                return { correcto: false, error: error.message };
            }
        } else {
            return { correcto: false, error: "Código de verificación incorrecto o no válido" };
        }
    }

    async check_codigo_verif_update(correo, codigo, nuevaCont) {
        console.log(temp[correo].codigo);
        if (temp[correo] && temp[correo].codigo === codigo) {
            try {
                const conexion = await db.conectar();
                const contrasenia = await bcrypt.hash(nuevaCont, saltos); // Esperar a que se resuelva la promesa de hash
                const [results, _] = await conexion.query(`UPDATE usuario SET contraseniaUsuario = ? WHERE correoUsuario = ?`, [contrasenia, correo]);

                if (results && results.affectedRows === 1) {
                    eliminarTemp();
                    return { correcto: true, error: null };
                } else {
                    return { correcto: false, error: "Error al insertar en la base de datos" };
                }
            } catch (error) {
                return { correcto: false, error: error.message };
            }
        } else {
            return { correcto: false, error: "Código de verificación incorrecto o no válido" };
        }
    }

}

module.exports = new Session();
