const express = require("express");
const router = express.Router();
const modeloSesion = require("../modelo/ModeloSession.js");

router.post("/log-in", async (req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const result = await modeloSesion.check_correo(correo, contrasenia);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión: " + error });
    }
});

router.post("/sign-up", async (req, res) => {
    const { nombre, correo, contrasenia } = req.body;
    try {
        const result = await modeloSesion.enviar_codigo_verif(nombre, correo, contrasenia, false);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Error al enviar código de verificación: " + error });
    }
});

router.post("/restart-password", async (req, res) => {
    const { correo } = req.body;
    try {
        const result = await modeloSesion.enviar_codigo_verif(null, correo, null, true);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Error al enviar código de verificación: " + error });
    }
});

router.post('/update-password', async (req, res) => {
    const { correo, codigo, nuevaCont } = req.body;
    try {
        const result = await modeloSesion.check_codigo_verif_update(correo, codigo, nuevaCont);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al verificar código de verificación: " + error });
    }
});

router.post("/check-code", async (req, res) => {
    const { correo, codigo } = req.body;
    try {
        const result = await modeloSesion.check_codigo_verif(correo, codigo);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al verificar código de verificación: " + error });
    }
});

module.exports = router;
