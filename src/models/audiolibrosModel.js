const pool = require('../services/db');

const AudiolibrosModel = {
    async newAudiolibro(titulo, autorId, descripcion, imgUrl) {
        try {
            const { rows } = await pool.query(
                "INSERT INTO audiolibros (titulo, autor, descripcion, img) VALUES ($1, $2, $3, $4) RETURNING *", 
                [titulo, autorId, descripcion, imgUrl]);
            return rows[0];
        } catch (error) {
            console.error("Error al insertar nuevo audiolibro:", error);
            return null;
        }
    },

    async updateAudiolibro(audiolibroId, titulo, autorId, descripcion, imgUrl) {
        try {
            await pool.query(
                "UPDATE audiolibros SET titulo = $1, autor = $2, descripcion = $3, img = $4 WHERE id = $5", 
                [titulo, autorId, descripcion, imgUrl, audiolibroId]);
        } catch (error) {
            console.error("Error al actualizar audiolibro:", error);
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
    },
    
    async subirCapitulo(audiolibroId, numeroCapitulo, audioUrl) {
        try {
            await pool.query(
                "INSERT INTO capitulos (numero, nombre, audiolibro, audio) VALUES ($1, $2, $3, $4)", 
                [numeroCapitulo, "Capítulo " + numeroCapitulo, audiolibroId, audioUrl]);
        } catch (error) {
            console.error("Error al añadir nuevo capítulo:", error);
            throw error;
        }
    },

    async eliminarCapitulo(audiolibroId, audioUrl) {
        try {
            await pool.query(
                "DELETE FROM capitulos WHERE audiolibro = $1 AND audio = $2", 
                [audiolibroId, audioUrl]);
        } catch (error) {
            console.error("Error al eliminar un capítulo:", error);
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