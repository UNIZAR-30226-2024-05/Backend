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
    },

    async getUltimoAudiolibro(username) {
        try {
            const audiolibros = await pool.query(`SELECT DISTINCT audiolibros.*, capitulos.*, marcapaginas.*
            FROM audiolibros
            JOIN capitulos ON audiolibros.id = capitulos.audiolibro
            JOIN marcapaginas ON capitulos.id = marcapaginas.capitulo
            JOIN users ON marcapaginas.usuario = users.id
            WHERE  marcapaginas.tipo = '0' AND users.username = $1;
            `, [username]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al obtener el ultimo audiolibro del usuario:", error);
            throw error;
        }
    }
};

module.exports = AudiolibrosModel;