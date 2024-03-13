const pool = require('../db');

const AudiolibrosModel = {
    async getAudiolibroByGenero(genero) {
        try {
            const audiolibros = await pool.query(`
                SELECT a.*
                FROM audiolibros a
                INNER JOIN genero_audiolibro ga ON a.id = ga.audiolibro
                INNER JOIN generos g ON ga.genero = g.id
                WHERE g.nombre = $1
            `, [genero]);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros por género:", error);
            throw error;
        }
    },

    async getAudiolibroByNombre(nombre) {
        try {
            const audiolibros = await pool.query(`Select * from audiolibros WHERE titulo ILIKE $1`, [`%${nombre}%`]);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros por nombre:", error);
            throw error;
        }
    }
};

module.exports = AudiolibrosModel;