const pool = require('../db');

const AudiolibrosModel = {
    async getAllAudiolibros() {
        try {
            const audiolibros = await pool.query(`
                SELECT a.id, a.titulo, aut.nombre AS autor, g.nombre AS genero, a.descripcion, a.img, 
                COALESCE(ROUND(AVG(r.puntuacion)::numeric, 2), 0.00) AS puntuacion
                FROM audiolibros a
                JOIN genero_audiolibro ga ON a.id = ga.audiolibro
                JOIN generos g ON ga.genero = g.id
                LEFT JOIN reviews r ON a.id = r.audiolibro
                JOIN autores aut ON a.autor = aut.id
                GROUP BY a.id, aut.nombre, g.nombre
            `);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros", error);
            throw error;
        }
    },

    async getAudiolibroById(id) {
        try {
            const audiolibros = await pool.query('SELECT * FROM audiolibros WHERE id = $1', [id]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al obtener audiolibro por id:", error);
            throw error;
        }
    },

    async getGenerosOfAudiolibro(id) {
        try {
            const generos = await pool.query(`SELECT g.nombre 
                                            FROM generos g 
                                            INNER JOIN (SELECT * FROM genero_audiolibro WHERE audiolibro = $1) AS ga 
                                            ON g.id = ga.genero`, [id]);
            return generos.rows;
        } catch (error) {
            console.error("Error al obtener audiolibro por id:", error);
            throw error;
        }
    },

    async getCapitulosOfAudiolibro(id) {
        try {
            const capitulos = await pool.query(`SELECT id, numero, nombre, audio 
                                            FROM capitulos WHERE audiolibro = $1`,
                                            [id]);
            return capitulos.rows;
        } catch (error) {
            console.error("Error al obtener los capitulos:", error);
            throw error;
        }
    }
};

module.exports = AudiolibrosModel;