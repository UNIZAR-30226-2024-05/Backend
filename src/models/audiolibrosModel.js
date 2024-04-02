const pool = require('../services/db');

const AudiolibrosModel = {
    async newAudiolibro(titulo, autorId, descripcion, imgUrl) {
        try {
            await pool.query(
                "INSERT INTO audiolibros (titulo, autor, descripcion, img) VALUES ($1, $2, $3, $4)", 
                [titulo, autorId, descripcion, imgUrl]);
        } catch (error) {
            console.error("Error al insertar nuevo audiolibro:", error);
            throw error;
        }
    },

    async deleteAudiolibro(audiolibroId) {
        try {
            await pool.query(
                "DELETE FROM audiolibros WHERE id = $1", 
                [audiolibroId]);
        } catch (error) {
            console.error("Error al eliminar un audiolibro:", error);
            throw error;
        }
    },

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

    async getAudiolibroById(audiolibroId) {
        try {
            const audiolibro = await pool.query(
                "SELECT * FROM audiolibros WHERE id = $1", 
                [audiolibroId]);
            return audiolibro.rows[0];
        } catch (error) {
            console.error("Error al obtener el audiolibro:", error);
            throw error;
        }
    }
};

module.exports = AudiolibrosModel;