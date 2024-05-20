const db = require("../servicios/db");

class Pet {
    async Get_All() {
        try {
            const conexion = await db.conectar();
            const [results] = await conexion.query(`SELECT mascota.idMascota as id, especiemascota.especieMascota AS especie, mascota.srcImagenMascota as imagen, mascota.nombreMascota as nombre, CONCAT(mascota.edadMascota, ' años') as edad, mascota.sexoMascota as sexo, mascota.descripcionMascota AS descripcion, mascota.motivoMascota AS motivo FROM mascota JOIN especiemascota ON mascota.idEspecie = especiemascota.idEspecie`);

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

module.exports = new Pet(); 