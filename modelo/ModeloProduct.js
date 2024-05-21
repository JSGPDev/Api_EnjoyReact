const db = require("../servicios/db");
const enviarCorreo = require("../servicios/mailer")

class Product {
    async Get_All() {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(`SELECT producto.idProducto, producto.nombreProducto, producto.SrcImagenProducto, producto.tamanoProducto,  CONCAT('$',producto.precioProducto) as precioProducto, tipoproducto.tipo, especiemascota.especieMascota 
            FROM producto 
            JOIN tipoproducto ON producto.idTipo = tipoproducto.idTipo 
            JOIN especiemascota ON producto.idEspecie = especiemascota.idEspecie`);

            if (results.length > 0) {
                return { correcto: true, error: null, results: results };
            } else {
                return { correcto: false, error: "fallo en la consulta MySQL" };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Product();