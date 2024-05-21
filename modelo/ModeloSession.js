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
                return { correcto: true, error: null, results: { id: results[0].idUsuario, correo: results[0].correoUsuario } };
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
            const mensajeCorreo = `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333333;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    h1 {
                        color: #2196F3;
                    }
                    h2 {
                        color: #4CAF50;
                        text-align: center;
                        font-size: 32px;
                        border: 2px dashed #4CAF50;
                        padding: 10px;
                        margin: 20px 0;
                    }
                    p {
                        line-height: 1.6;
                    }
                    a {
                        color: #2196F3;
                        text-decoration: none;
                    }
                    .footer {
                        margin-top: 20px;
                        border-top: 1px solid #dddddd;
                        padding-top: 10px;
                        text-align: center;
                        font-size: 12px;
                        color: #aaaaaa;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Código de Verificación</h1>
                    <p>¡Hola!</p>
                    <p>Nos alegra que estés aquí. Para completar tu proceso de verificación, por favor usa el siguiente código:</p>
                    <strong><h2>${codigo}</h2></strong>
                    <p>Simplemente introduce este código en la página de verificación y estarás listo para continuar.</p>
                    <p>Si no has solicitado este código, no te preocupes, simplemente ignora este mensaje y mantén tus datos seguros.</p>
                    <p>Gracias por confiar en nosotros. Esperamos que disfrutes de tu experiencia con <strong>Enjoy Your Pet</strong>.</p>
                    <p>¡Que tengas un excelente día!</p>
                    <p>Saludos,</p>
                    <p><strong>El equipo de Enjoy Your Pet</strong></p>
                    <div class="footer">
                        <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
                        <p>© 2024 Enjoy Your Pet. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
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
