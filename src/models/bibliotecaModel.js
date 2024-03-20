const pool = require('../db');

const BibliotecaModel = {
    async getAudiolibrosColeccion(username, coleccion) {
        try {
            const audiolibros = await pool.query(
                `SELECT audiolibros.*
                FROM audiolibros
                INNER JOIN colecciones_audiolibros 
                ON audiolibros.id = colecciones_audiolibros.audiolibro
                INNER JOIN colecciones
                ON colecciones_audiolibros.coleccion = colecciones.id
                INNER JOIN colecciones_usuarios
                ON colecciones.id = colecciones_usuarios.coleccion
                INNER JOIN users
                ON colecciones_usuarios.usuario = users.id
                WHERE users.username = $1
                AND colecciones.titulo = $2`,
                [username, coleccion]
            );
            return audiolibros.rows;
        } catch (error) {
            throw error;
        }
    },

    async createCollection(title, ownerId) {
        try {
            const newCollection = await pool.query(
                "INSERT INTO colecciones (titulo, propietario) VALUES ($1, $2)",
                [title, ownerId]
            );
            return newCollection.rows[0];
        } catch (error) {
            throw error;
        }
    },
    
    async deleteCollection(collectionId) {
        try {
            const deletedCollection = await pool.query(
                "DELETE FROM colecciones WHERE id = $1",
                [collectionId]
            );
            return deletedCollection.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = BibliotecaModel;


