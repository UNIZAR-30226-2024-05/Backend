const pool = require('../db');

const BibliotecaModel = {
    async getUserCollections(username) {
        try {
            const audiolibros = await pool.query(
                `SELECT *
                FROM colecciones
                WHERE propietario = (SELECT id FROM users WHERE username = $1)
                UNION
                SELECT colecciones.*
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

    async createUserCollection(title, owner) {
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

    async getCollectionOwner(collectionId) {
        try {
            const collection = await pool.query(
                `SELECT u.username
                FROM colecciones c
                JOIN users u ON c.propietario = u.id
                WHERE c.id = $1`,
                [collectionId]
            );
            return collection.rows[0];
        } catch (error) {
            throw error;
        }
    },
    
    async deleteUserCollection(collectionId) {
        try {
            const deletedCollection = await pool.query(
                `DELETE FROM colecciones
                WHERE id = $1`,
                [collectionId]
            );
            return deletedCollection.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async removeFriendCollection(collectionId) {
        try {
            const deletedCollection = await pool.query(
                `DELETE FROM colecciones_usuarios
                WHERE coleccion = $1`,
                [collectionId]
            );
            return deletedCollection.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async addFriendCollection(collectionId, username) {
        try {
            const newCollection = await pool.query(
                `INSERT INTO colecciones_usuarios (coleccion, usuario)
                VALUES ($1, (SELECT id FROM users WHERE username = $2))`,
                [collectionId, username]
            );
            return newCollection.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async addAudiolibroColeccion(audiolibroId, coleccionId, username) {
        try {
            collectionOwner = this.getCollectionOwner(coleccionId);

            if (collectionOwner == username) {
                await pool.query(
                    `INSERT INTO colecciones_audiolibros (coleccion, audiolibro)
                    VALUES ($1, $2)`,
                    [coleccionId, audiolibroId]
                );
                return 0;
            } else {
                return -1;
            }
        } catch (error) {
            throw error;
        }
    },

    async removeAudiolibroColeccion(audiolibroId, coleccionId, username) {
        try {
            collectionOwner = this.getCollectionOwner(coleccionId);

            if (collectionOwner == username) {
                await pool.query(
                    `DELETE FROM colecciones_audiolibros WHERE audiolibro = $1`,
                    [audiolibroId]
                );
                return 0;
            } else {
                return -1;
            }
        } catch (error) {
            throw error;
        }
    }
};

module.exports = BibliotecaModel;


