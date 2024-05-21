const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const ModeloPost = require("../modelo/ModeloPost.js")

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        // Crea el directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.post('/new-post', upload.single('image'), async (req, res) => {
    const { idUser, postText } = req.body;
    try {

        const result = await ModeloPost.SavePost(idUser, req.file.path, postText);
        return (result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, error: 'Ocurrió un error al subir la imagen' });
    }
});

module.exports = router;