const pool = require('../db');

const BibliotecaModel = {
    async getAudiolibros(username) {
        try {
            const audiolibros = await pool.query(
                `SELECT audiolibros.*
                 FROM audiolibros
                 INNER JOIN audiolibros_usuarios 
                 ON audiolibros.id = audiolibros_usuarios.audiolibro
                 INNER JOIN users
                 ON audiolibros_usuarios.usuario = users.id
                 WHERE users.username = $1`,
                [username]
            );
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener los audiolibros", error);
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


