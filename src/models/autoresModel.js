const pool = require('../services/db');

const autoresModel = {
    async getAutor(nombre) {
        try {
            const autor = await pool.query(`SELECT DISTINCT autores.*
            FROM autores
            WHERE   autores.nombre = $1;
            `, [nombre]);
            return autor.rows[0];
        } catch (error) {
            console.error("Error al obtener los datos del autor:", error);
            throw error;
        }
    }
};

module.exports = autoresModel;
