const express = require("express");
const router = express.Router();
const ModeloPet = require("../modelo/ModeloPet.js");

router.get('/all', async (req, res) => {
    try {
        const result = await ModeloPet.Get_All();
        res.json(result.results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión: " + error });
    }
});

module.exports = router;