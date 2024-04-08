const pool = require('../db');

const AmistadModel = {
    async hayAmistad(user1_id, user2_id) {
        const hayAmistad = await pool.query(
            `SELECT * FROM amigos
            WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)`,
            [user1_id, user2_id]
        );
        return hayAmistad.rowCount;
    },

    async addAmistad(user1_id, user2_id) {
        await pool.query(
            "INSERT INTO amigos (user1, user2) VALUES ($1, $2)",
            [user1_id, user2_id]
        );
    },

    async removeAmistad(user1_id, user2_id) {
        await pool.query(
            `DELETE FROM amigos
            WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)`,
            [user1_id, user2_id]
        );
    },

    async getAmigos(user_id) {
        const amigos = await pool.query(
            `SELECT id, username FROM users
            WHERE id IN (
                SELECT CASE
                    WHEN user1 = $1 THEN user2
                    ELSE user1
                    END AS friend_id
                FROM amigos
                WHERE user1 = $1 OR user2 = $1)`,
            [user_id]
        );
        return amigos.rows;
    },

    async hayPeticionPendienteEnviada(user_id, other_id) {
        const peticionPendiente = await pool.query(
            `SELECT * FROM peticiones
            WHERE sender = $1 AND receiver = $2 AND estado = '0'`,
            [user_id, other_id]
        );
        return peticionPendiente.rowCount;
    },

    async hayPeticionPendienteRecibida(user_id, other_id) {
        const peticionPendiente = await pool.query(
            `SELECT * FROM peticiones
            WHERE sender = $2 AND receiver = $1 AND estado = '0'`,
            [user_id, other_id]
        );
        return peticionPendiente.rowCount;
    },

    async addPeticion(sender_id, receiver_id) {
        const peticion = await pool.query(
            `INSERT INTO peticiones (sender, receiver, estado, fecha)
            VALUES ($1, $2, '0', NOW()) 
            RETURNING sender, (SELECT username FROM users WHERE id = sender)`, 
            [sender_id, receiver_id]
        );
            return peticion.rows[0];
    },

    async acceptPeticion(user_id, other_id) {
        const peticion = await pool.query(
            `UPDATE peticiones SET estado = 1, fecha = NOW()
            WHERE sender = $2 and receiver = $1 and estado = '0'
            RETURNING receiver, (SELECT username FROM users WHERE id = receiver)`,
            [user_id, other_id]
        );
        return peticion.rows[0];
    },

    async rejectPeticion(user_id, other_id) {
        const peticion = await pool.query(
            `UPDATE peticiones SET estado = 2, fecha = NOW()
            WHERE sender = $2 and receiver = $1 and estado = '0'
            RETURNING receiver, (SELECT username FROM users WHERE id = receiver)`,
            [user_id, other_id]
        );
        return peticion.rows[0];
    },

    async cancelPeticion(user_id, other_id) {
        await pool.query(
            `DELETE FROM peticiones
            WHERE sender = $1 and receiver = $2 and estado = '0'`,
            [user_id, other_id]
        );
    },

    async getPeticionesEnviadas(user_id) {
        const peticiones = await pool.query(
            `SELECT u.id AS user_id, u.username, p.fecha 
            FROM peticiones p JOIN users u ON p.receiver = u.id
            WHERE p.sender = $1 AND p.estado = '0'`,
            [user_id]);
        return peticiones.rows;
    },

    async getPeticionesRecibidas(user_id) {
        const peticiones = await pool.query(
            `SELECT u.id AS user_id, u.username, p.fecha 
            FROM peticiones p JOIN users u ON p.sender = u.id
            WHERE p.receiver = $1 AND p.estado = '0'`,
            [user_id]);
        return peticiones.rows;
    },

    async getPeticionesAceptadas(user_id) {
        const peticiones = await pool.query(
            `SELECT u.id AS user_id, u.username, p.fecha 
            FROM peticiones p JOIN users u ON p.receiver = u.id
            WHERE p.sender = $1 AND p.estado = '1'`,
            [user_id]);
        return peticiones.rows;
    },

    async getPeticionesRechazadas(user_id) {
        const peticiones = await pool.query(
            `SELECT u.id AS user_id, u.username, p.fecha 
            FROM peticiones p JOIN users u ON p.receiver = u.id
            WHERE p.sender = $1 AND p.estado = '2'`,
            [user_id]);
        return peticiones.rows;
    }
};

module.exports = AmistadModel;