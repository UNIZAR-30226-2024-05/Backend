const pool = require('../db');

const autoresModel = {
   

    async CrearAutor(nombre, info) {
        try {
            const newAutor = await pool.query(
            "INSERT INTO marcapaginas (nombre, info) VALUES ($1, $2)"
            , [nombre, info]);
            return newAutor.rows[0];
        } catch (error) {
            console.error("Error al crear el autor:", error);
            throw error;
        }
    },

    async BorrarAutor(id) {
        try {
            const borrado = await pool.query(`DELETE FROM marcapaginas WHERE id = $1;
            `, [id]);
            return borrado.rows[0];
        } catch (error) {
            console.error("Error al borrar el marcapaginas del usuario:", error);
            throw error;
        }
    },

    async ActualizarAutor(id, nombre, info) {
        try {
            const audiolibros = await pool.query("UPDATE marcapaginas SET nombre = $2, info = $3  WHERE id = $1;",
            [id, nombre, info]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al actualizar el autor del usuario:", error);
            throw error;
        }
    },

    async getAudiolibrosPorAutor(idAutor) {
        try {
            const audiolibros = await pool.query(`
                SELECT DISTINCT audiolibros.*
                FROM audiolibros
                JOIN autores ON audiolibros.autor = autores.id
                WHERE autores.id = $1;
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
    }
};


module.exports = autoresModel;