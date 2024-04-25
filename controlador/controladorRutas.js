const express = require("express");
const router = express.Router();
const modeloSesion = require("../model/modeloSesion.js")

router.get("/", (req, res) => {
    const message = `
        <h1>Bienvenido a la API de autenticación</h1>
        <p>Aquí tienes una descripción de las rutas disponibles:</p>
        <ul>
            <li><strong>POST /log-in</strong>: Iniciar sesión. Envía el correo electrónico y la contraseña.</li>
            <li><strong>POST /sign-up</strong>: Registrarse. Envía el correo electrónico y la contraseña para crear una nueva cuenta.</li>
            <li><strong>POST /check-code</strong>: Verificar código de verificación. Envía el correo electrónico y el código de verificación.</li>
        </ul>
        <p>Para obtener más detalles sobre cómo usar cada ruta, consulta la documentación.</p>
    `;
    res.send(message);
});


router.post("/log-in", async (req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const result = await modeloSesion.check_correo(correo, contrasenia);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

router.post("/sign-up", async (req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const result = await modeloSesion.enviar_codigo_verif(correo, contrasenia);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Error al enviar código de verificación" });
    }
});


router.post("/check-code", async (req, res) => {
    const { correo, codigo } = req.body;
    try {
        const result = await modeloSesion.check_codigo_verif(correo, codigo);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al verificar código de verificación" });
    }
});

module.exports = router;
