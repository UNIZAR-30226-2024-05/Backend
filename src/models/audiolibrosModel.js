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

    async getAllAudiolibros() {
        try {
            const audiolibros = await pool.query(`
                SELECT a.id, a.titulo, a.autor AS autor_id, aut.nombre AS autor, g.nombre AS genero, a.descripcion, a.img, 
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

    async getAudiolibroById(audiolibroId) {
        try {
            const audiolibro = await pool.query(
                `SELECT a.*, COALESCE(ROUND(AVG(r.puntuacion)::numeric, 2), 0.00) AS puntuacion 
                FROM audiolibros a LEFT JOIN reviews r ON a.id = r.audiolibro 
                WHERE a.id = $1
                GROUP BY a.id`, 
                [audiolibroId]);
            return audiolibro.rows[0];
        } catch (error) {
            console.error("Error al obtener el audiolibro:", error);
            throw error;
        }
    },

    async getGeneroIdByName(genero) {
        try {
            const generos = await pool.query(`SELECT * FROM generos WHERE nombre = $1`, [genero]);
            return generos.rows[0].id;
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

    async setGenerosOfAudiolibro(audiolibroId, generoId) {
        try {
            await pool.query(
                `INSERT INTO genero_audiolibro (audiolibro, genero) VALUES ($1, $2)`, 
                [audiolibroId, generoId]);
        } catch (error) {
            console.error("Error al establecer el genero de un audiolibro:", error);
            throw error;
        }
    },

    async deleteGeneroAudiolibro(audiolibroId) {
        try {
            await pool.query(
                `DELETE FROM genero_audiolibro WHERE audiolibro = $1`, 
                [audiolibroId]);
        } catch (error) {
            console.error("Error al establecer el genero de un audiolibro:", error);
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
    }
};

module.exports = AudiolibrosModel;
