const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const modeloPost = require("../modelo/ModeloPost.js")
// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
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

// Filtros y límites de multer
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño de archivo 5MB
}).single('image');

router.get('/all', async (req, res) => {
    try {
        const result = await modeloPost.Geat_All();
        res.json({ correcto: true, "results": result.results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ correcto: false, error: "en la base de datos: " + error });
    }
})

// Endpoint para subir una nueva publicación
router.post('/new-post', (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ correcto: false, error: err.message });
        } else if (err) {
            return res.status(400).json({ correcto: false, error: 'Solo se permiten imágenes' });
        }

        const { idUser, postText } = req.body;
        if (!idUser || !postText || !req.file) {
            return res.status(400).json({ correcto: false, error: 'Datos incompletos' });
        }

        try {
            const host = req.get('host'); // Obtiene el host del servidor
            const imagePath = req.file.filename;
            const imageUrl = `http://${host}/post/image/${imagePath}`; // Construye la URL de la imagen

            const result = await modeloPost.SavePost(idUser, imageUrl, postText); // Guarda la URL de la imagen
            res.status(201).json({ correcto: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ correcto: false, error: 'Ocurrió un error al subir la imagen' });
        }
    });
});

// Endpoint para servir la imagen
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads', filename);
    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }
        res.sendFile(filepath);
    });
});

module.exports = router;
