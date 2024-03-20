const pool = require('../db');
const UserModel = require('./userModel')

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

    async getUserCollections(username) {
        try {
            const audiolibros = await pool.query(
                `SELECT colecciones.*
                FROM colecciones
                INNER JOIN colecciones_usuarios 
                ON colecciones.id = colecciones_usuarios.coleccion
                INNER JOIN users
                ON colecciones_usuarios.usuario = users.id
                WHERE users.username = $1`,
                [username]
            );
            return audiolibros.rows;
        } catch (error) {
            throw error;
        }
    },

    async createCollection(title, owner) {
        try {
            const newCollection = await pool.query(
                `INSERT INTO colecciones (titulo, propietario)
                VALUES ($1, (SELECT id FROM users WHERE username = $2))`,
                [title, owner]
            );

            return newCollection.rows[0];
        } catch (error) {
            throw error;
        }
    },
    
    async deleteUserCollection(title, owner) {
        try {
            const deletedCollection = await pool.query(
                `DELETE FROM colecciones
                WHERE titulo = $1
                AND propietario = (
                    SELECT id FROM users WHERE username = $2
                )`,
                [title, owner]
            );
            return deletedCollection.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = BibliotecaModel;


