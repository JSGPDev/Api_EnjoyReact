const db = require("../servicios/db");
const enviarCorreo = require("../servicios/mailer")

class Pet {
    async Get_All() {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(`SELECT mascota.idMascota as id, especiemascota.especieMascota AS especie, mascota.srcImagenMascota as imagen, mascota.nombreMascota as nombre, CONCAT(mascota.edadMascota, ' años') as edad, mascota.sexoMascota as sexo, mascota.descripcionMascota AS descripcion, mascota.motivoMascota AS motivo FROM mascota JOIN especiemascota ON mascota.idEspecie = especiemascota.idEspecie`);

            if (results.length > 0) {
                return { correcto: true, error: null, results: results };
            } else {
                return { correcto: false, error: "fallo en la consulta MySQL" };
            }
        } catch (error) {
            throw error;
        }
    }

    async Adopt(petId, userId) {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(
                `SELECT 
                    dueno.nombreUsuario AS nombre_dueno, 
                    dueno.correoUsuario AS correo_dueno, 
                    dueno.telefonoUsuario AS telefono_dueno, 
                    adoptante.nombreUsuario AS nombre_adoptante, 
                    adoptante.correoUsuario AS correo_adoptante, 
                    adoptante.telefonoUsuario AS telefono_adoptante, 
                    m.nombreMascota AS nombre_Mascota 
                 FROM mascota m 
                 JOIN usuario dueno ON m.idUsuario = dueno.idUsuario 
                 JOIN usuario adoptante ON adoptante.idUsuario = ? 
                 WHERE m.idMascota = ?`,
                [userId, petId]
            );

            if (results.length === 0) {
                throw new Error('No se encontró la información de la mascota o el usuario.');
            }

            const result = results[0];

            const mensajeAdoptadorCorreo = `<!DOCTYPE html>
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
                        color: #4CAF50;
                    }
                    p {
                        line-height: 1.6;
                    }
                    a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #4CAF50;
                        border-radius: 5px;
                        text-decoration: none;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Adoptaste una mascota!</h1>
                    <p>Hola <strong>${result.nombre_adoptante}</strong>,</p>
                    <p>Nos complace informarte que acabas de adoptar a <strong>${result.nombre_Mascota}</strong>. ¡Estamos seguros de que serán muy felices juntos!</p>
                    <p>Para más detalles, puedes comunicarte con el dueño anterior, <strong>${result.nombre_dueno}</strong>, a través de su correo electrónico: <a href="mailto:${result.correo_dueno}">${result.correo_dueno}</a> o en su WhatsApp:</p>
                    <a class="button" href="https://wa.me/${result.telefono_dueno}?text=Hola,%20¿cómo%20estás?%20soy%20${result.nombre_adoptante}%20y%20acabo%20de%20adoptar%20a%20${result.nombre_Mascota}">Contactar por WhatsApp</a>
                </div>
            </body>
            </html>`;

            const mensajeDuenoCorreo = `<!DOCTYPE html>
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
                    p {
                        line-height: 1.6;
                    }
                    a {
                        color: #2196F3;
                        text-decoration: none;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        color: #ffffff;
                        background-color: #2196F3;
                        border-radius: 5px;
                        text-decoration: none;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>¡Adoptaron a ${result.nombre_Mascota}!</h1>
                    <p>Hola <strong>${result.nombre_dueno}</strong>,</p>
                    <p>Te informamos que <strong>${result.nombre_adoptante}</strong> ha adoptado a <strong>${result.nombre_Mascota}</strong>. Esperamos que encuentres consuelo en saber que tu querida mascota está en buenas manos.</p>
                    <p>Puedes ponerte en contacto con el nuevo adoptante a través de su correo electrónico: <a href="mailto:${result.correo_adoptante}">${result.correo_adoptante}</a> o en su WhatsApp:</p>
                    <a class="button" href="https://wa.me/${result.telefono_adoptante}?text=Hola,%20${result.nombre_adoptante},%20acabas%20de%20adoptar%20a%20${result.nombre_Mascota}">Contactar por WhatsApp</a>
                </div>
            </body>
            </html>
            `;

            try {
                await enviarCorreo(result.correo_adoptante, "¡Adoptaste a una mascota!", mensajeAdoptadorCorreo);
                await enviarCorreo(result.correo_dueno, `¡Adoptaron a ${result.nombre_Mascota}!`, mensajeDuenoCorreo);
                const [res] = await conexion.query('DELETE FROM mascota WHERE mascota.idMascota = ?', [petId]);
                return { correcto: true, error: null, result: result };
            } catch (error) {
                return { correcto: false, error: "Fallo el proceso de adopción: " + error.message };
            }

        } catch (error) {
            return { correcto: false, error: "Error en la adopción: " + error.message };
        }
    }

}

module.exports = new Pet(); 