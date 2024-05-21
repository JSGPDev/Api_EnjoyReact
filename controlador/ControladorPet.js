const express = require("express");
const router = express.Router();
const modeloPet = require("../modelo/ModeloPet.js");

router.get('/all', async (req, res) => {
    try {
        const result = await modeloPet.Get_All();
        res.json({ correcto: true, "results": result.results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, error: "Error al iniciar sesión: " + error });
    }
});

router.get('/adopt/:petId/:userId', async (req, res) => {
    const { petId, userId } = req.params;
    try {
        const result = await modeloPet.Adopt(petId, userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, error: "Error al gestionar la adopcion: " + error });
    }
})


module.exports = router;