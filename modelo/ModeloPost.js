const db = require("../servicios/db");

class Post {
    async Geat_All() {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(`SELECT 
            p.idPost,
            u.idUsuario,
            u.nombreUsuario,
            u.SrcImagenUsuario,
            p.textPost,
            p.srcImgPost,
            r.idRespuesta,
            ru.idUsuario AS idUsuarioRespuesta,
            ru.nombreUsuario AS nombreUsuarioRespuesta,
            ru.SrcImagenUsuario AS srcImgUsuarioRespuesta,
            r.textRespuesta
        FROM 
            post p
        JOIN 
            usuario u ON p.idUsuario = u.idUsuario
        LEFT JOIN 
            respuestapost r ON p.idPost = r.idPost
        LEFT JOIN 
            usuario ru ON r.idUsuario = ru.idUsuario
        ORDER BY 
            p.idPost, r.idRespuesta;
        `);

            if (results.length > 0) {
                return { correcto: true, error: null, results: results };
            } else {
                return { correcto: false, error: "fallo en la consulta MySQL" };
            }
        } catch (error) {
            throw error;
        }
    }

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

module.exports = new Post();