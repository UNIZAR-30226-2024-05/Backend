const pool = require('../db');

const autoresModel = {
   

    async CrearAutor(nombre, info,ciudad) {
        try {
            const newAutor = await pool.query(
            "INSERT INTO autores (nombre, informacion, ciudadNacimiento) VALUES ($1, $2,$3)"
            , [nombre, info,ciudad]);
            return newAutor.rows[0];
        } catch (error) {
            console.error("Error al crear el autor:", error);
            throw error;
        }
    },

    async BorrarAutor(id) {
        try {
            const borrado = await pool.query(`DELETE FROM autores WHERE id = $1;
            `, [id]);
            return borrado.rows[0];
        } catch (error) {
            console.error("Error al borrar el marcapaginas del usuario:", error);
            throw error;
        }
    },

    async ActualizarAutor(id, nombre, info,ciudad) {
        try {
            const audiolibros = await pool.query("UPDATE autores SET nombre = $2, informacion = $3, ciudadNacimiento = $4  WHERE id = $1;",
            [id, nombre, info,ciudad]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al actualizar el autor del usuario:", error);
            throw error;
        }
    },

    async getAudiolibrosPorAutor(idAutor) {
        try { 
            const audiolibros = await pool.query(`
            SELECT DISTINCT audiolibros.id, 
            audiolibros.titulo, 
            audiolibros.img, 
            ROUND(COALESCE(AVG(reviews.puntuacion), 0.00), 2) AS puntuacion
            FROM audiolibros
            JOIN autores ON audiolibros.autor = autores.id
            LEFT JOIN reviews ON audiolibros.id = reviews.audiolibro
            WHERE autores.id = $1
            GROUP BY audiolibros.id, audiolibros.titulo, audiolibros.img;
            `, [idAutor]);
    
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros por autor:", error);
            throw error;
        }
    },
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
    },

    async getAutorBasicoByID(id) {
        try {
            const autor = await pool.query(`SELECT id, nombre
                FROM autores
                WHERE autores.id = $1;`, [id]
            );
            return autor.rows[0];
        } catch (error) {
            console.error("Error al obtener los datos del autor:", error);
            throw error;
        }
    },

    async getAutorByID(id) {
        try {
            const autor = await pool.query(`SELECT DISTINCT autores.*
            FROM autores
            WHERE   autores.id = $1;
            `, [id]);
            return autor.rows[0];
        } catch (error) {
            console.error("Error al obtener los datos del autor:", error);
            throw error;
        }
    },
    async getGeneroMasEscrito(id) {
        try {
            const autor = await pool.query(`
            SELECT generos.nombre AS genero, COUNT(*) AS conteo
            FROM autores
            JOIN audiolibros ON autores.id = audiolibros.autor
            JOIN genero_audiolibro ON audiolibros.id = genero_audiolibro.audiolibro
            JOIN generos ON genero_audiolibro.genero = generos.id
            WHERE autores.id = $1
            GROUP BY generos.nombre
            ORDER BY conteo DESC
            LIMIT 1;
            `, [id]);
            return autor.rows[0];
        } catch (error) {
            console.error("Error al obtener los datos del autor:", error);
            throw error;
        }
    },
    async getPuntuacionMediaAutor(id) {
        try {
            const media = await pool.query(`
            SELECT AVG(r.puntuacion) AS media_puntuacion
            FROM autores a
            JOIN audiolibros au ON a.id = au.autor
            JOIN reviews r ON au.id = r.audiolibro
            WHERE a.id = $1;
            `, [id]);
            return media.rows[0];
        } catch (error) {
            console.error("Error al obtener la puntuación media del autor:", error);
            throw error;
        }
    }
};


module.exports = autoresModel;