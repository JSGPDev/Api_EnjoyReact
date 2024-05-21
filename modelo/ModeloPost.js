const db = require("../servicios/db");

class Post {
    async SavePost(idUser, srcImg, text) {
        try {

            const conexion = await db.conectar();
            const [results] = await conexion.query('INSERT INTO post(idUsuario, srcImgPost, textPost) VALUES(?,?,?)', [idUser, srcImg, text]);
            if (results && results.affectedRows === 1) {
                eliminarTemp();
                return { correcto: true, error: null };
            } else {
                return { correcto: false, error: "Error al insertar en la base de datos" };
            }
        } catch (error) {
            return { correcto: false, error: error.message };
        }
    }
}

module.exports = Post;