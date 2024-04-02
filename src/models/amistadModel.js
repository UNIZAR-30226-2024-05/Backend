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

    async hayPeticionPendienteEnviada(user_id, other_id) {
        const peticionPendiente = await pool.query(
            `SELECT * FROM peticiones
            WHERE sender = $1 AND receiver = $2 AND estado = 0`,
            [user_id, other_id]
        );
        return peticionPendiente.rowCount;
    },

    async hayPeticionPendienteRecibida(user_id, other_id) {
        const peticionPendiente = await pool.query(
            `SELECT * FROM peticiones
            WHERE sender = $2 AND receiver = $1 AND estado = 0`,
            [user_id, other_id]
        );
        return peticionPendiente.rowCount;
    },

    async addPeticion(sender_id, receiver_id) {
        await pool.query(
            `INSERT INTO peticiones (sender, receiver, estado, fecha)
            VALUES ($1, $2, 0, NOW())`, 
            [sender_id, receiver_id]);
    },

    async acceptPeticion(user_id, other_id) {
        await pool.query(
            `UPDATE peticiones SET estado = 1, fecha = NOW()
            WHERE sender = $2 and receiver = $1`,
            [user_id, other_id]
        );
    },

    async rejectPeticion(user_id, other_id) {
        await pool.query(
            `UPDATE peticiones SET estado = 2, fecha = NOW()
            WHERE sender = $2 and receiver = $1`,
            [user_id, other_id]
        );
    },

    async cancelPeticion() {
        await pool.query(
            `UPDATE peticiones SET estado = 3, fecha = NOW()
            WHERE sender = $1 and receiver = $2`,
            [user_id, other_id]
        );
    }
};

module.exports = AmistadModel;