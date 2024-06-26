const pool = require('../services/db');

const BibliotecaModel = {
    async getColeccionById(coleccion_id) {
        try {
            const colecciones = await pool.query(
                `SELECT * FROM colecciones WHERE id = $1`,
                [coleccion_id]
            );
            return colecciones.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async getUserCollections(user_id) {
        try {
            const audiolibros = await pool.query(
                `SELECT *
                FROM colecciones
                WHERE propietario = $1
                UNION
                SELECT colecciones.*
                FROM colecciones
                INNER JOIN colecciones_usuarios ON colecciones.id = colecciones_usuarios.coleccion
                WHERE colecciones_usuarios.usuario = $1`,
                [user_id]
            );
            return audiolibros.rows;
        } catch (error) {
            throw error;
        }
    },

    async getCollectionOwner(collectionId) {
        try {
            const audiolibros = await pool.query(
                `SELECT u.id, u.username
                FROM colecciones c
                JOIN users u ON c.propietario = u.id
                WHERE c.id = $1`,
                [collectionId]
            );
            return audiolibros.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async coleccionGuardada(user_id, coleccionId) {
        try {
            const audiolibros = await pool.query(
                `SELECT * FROM colecciones_usuarios WHERE usuario = $1 AND coleccion = $2`,
                [user_id, coleccionId]
            );
            return audiolibros.rows.length > 0;
        } catch (error) {
            throw error;
        }
    },

    async getAudiolibrosColeccion(coleccionId) {
        try {
            const audiolibros = await pool.query(
                `SELECT audiolibros.*, autores.nombre AS nombre_autor
                FROM audiolibros
                INNER JOIN colecciones_audiolibros ON audiolibros.id = colecciones_audiolibros.audiolibro
                INNER JOIN autores ON audiolibros.autor = autores.id
                WHERE colecciones_audiolibros.coleccion = $1`,
                [coleccionId]
            );
            return audiolibros.rows;
        } catch (error) {
            throw error;
        }
    },

    async createUserCollection(title, owner) {
        try {
            await pool.query(
                `INSERT INTO colecciones (titulo, propietario)
                VALUES ($1, $2)`,
                [title, owner]
            );
        } catch (error) {
            throw error;
        }
    },
    
    async deleteUserCollection(collectionId) {
        try {
            await pool.query(
                `DELETE FROM colecciones WHERE id = $1`,
                [collectionId]
            );
        } catch (error) {
            throw error;
        }
    },

    async removeFriendCollection(collectionId, user_id) {
        try {
            await pool.query(
                `DELETE FROM colecciones_usuarios
                WHERE coleccion = $1 AND usuario = $2`,
                [collectionId, user_id]
            );
        } catch (error) {
            throw error;
        }
    },

    async addFriendCollection(collectionId, user_id) {
        try {
            await pool.query(
                `INSERT INTO colecciones_usuarios (coleccion, usuario)
                VALUES ($1, $2)`,
                [collectionId, user_id]
            );
        } catch (error) {
            throw error;
        }
    },

    async addAudiolibroColeccion(audiolibroId, coleccionId, user_id) {
        try {
            const coleccion = await this.getColeccionById(coleccionId);
            if (coleccion.propietario == user_id) {
                await pool.query(
                    `INSERT INTO colecciones_audiolibros (coleccion, audiolibro)
                    VALUES ($1, $2)`,
                    [coleccionId, audiolibroId]
                );
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            throw error;
        }
    },

    async removeAudiolibroColeccion(audiolibroId, coleccionId, user_id) {
        try {
            const coleccion = await this.getColeccionById(coleccionId);

            if (coleccion.propietario == user_id) {
                await pool.query(
                    `DELETE FROM colecciones_audiolibros WHERE audiolibro = $1 AND coleccion = $2`,
                    [audiolibroId, coleccionId]
                );
                return 1;
            } else {
                return 0;
            }
        } catch (error) {
            throw error;
        }
    },

    // Devuelve las colecciones propiedad de un usuario e indica si el audiolibro
    //  está en cada colección (columna con true/false)
    async audiolibroPerteneceColecciones(audiolibroId, user_id) {
        try {
            const colecciones = await pool.query(
                `SELECT c.id, c.titulo,
                    CASE 
                        WHEN ca.coleccion IS NOT NULL THEN TRUE 
                        ELSE FALSE 
                    END AS pertenece
                FROM colecciones c
                    LEFT JOIN colecciones_audiolibros ca ON c.id = ca.coleccion AND ca.audiolibro = $1
                WHERE c.propietario = $2`,
                [audiolibroId, user_id]
            );
            return colecciones.rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = BibliotecaModel;
