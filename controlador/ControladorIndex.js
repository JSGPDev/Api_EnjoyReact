const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const message = `
        <h1>Bienvenido a la API de autenticación</h1>
        <p>Aquí tienes una descripción de las rutas disponibles:</p>
        <ul>
            <li><strong>POST /session/log-in</strong>: Iniciar sesión. Envía el correo electrónico y la contraseña.</li>
            <li><strong>POST /session/sign-up</strong>: Registrarse. Envía el correo electrónico y la contraseña para crear una nueva cuenta.</li>
            <li><strong>POST /session/check-code</strong>: Verificar código de verificación. Envía el correo electrónico y el código de verificación.</li>
            <li><strong>POST /session/restart-password</strong>: Reiniciar contraseña. Envía el correo electrónico para recibir un código de verificación.</li>
            <li><strong>POST /session/update-password</strong>: Actualizar contraseña. Envía el correo electrónico, el código de verificación y la nueva contraseña.</li>
        </ul>
        <p>Para obtener más detalles sobre cómo usar cada ruta, consulta la documentación.</p>
    `;
    res.send(message);
});

module.exports = router;
