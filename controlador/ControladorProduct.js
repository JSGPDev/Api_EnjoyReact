const express = require("express");
const router = express.Router();
const modeloProduct = require("../modelo/ModeloProduct.js")

router.get('/all', async (req, res) => {
    try {
        const result = await modeloProduct.Get_All();
        res.json({ correcto: true, "results": result.results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, error: "Error al iniciar sesión: " + error });
    }
});

module.exports = router;