const pool = require('../db');

const AudiolibrosModel = {
    async getAllAudiolibros() {
        try {
            const audiolibros = await pool.query(`
                SELECT a.*, g.nombre AS genero, COALESCE(ROUND(AVG(r.puntuacion)::numeric, 2), 0.00) AS puntuacion
                FROM audiolibros a
                JOIN genero_audiolibro ga ON a.id = ga.audiolibro
                JOIN generos g ON ga.genero = g.id
                LEFT JOIN reviews r ON a.id = r.audiolibro
                GROUP BY a.id, g.nombre
            `);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros", error);
            throw error;
        }
    }
};

module.exports = AudiolibrosModel;