const pool = require('../services/db');

const ReviewModel = {

    async getReviewById(id_review) {
        const review = await pool.query(
            `SELECT * FROM reviews WHERE id = $1`,
            [id_review]
        );
        return review.rowCount;
    },

    async alreadyExistingReview(id_audiolibro, user_id) {
        const review = await pool.query(
            `SELECT id FROM reviews WHERE audiolibro = $1 AND usuario  = $2`,
            [id_audiolibro, user_id]
        );
        return review.rowCount;
    },

    async reviewBelongsToUser(id_review, id_user) {
        if (id_review === null || id_review === undefined) {
            throw new Error('Los parámetros id_review y id_user son obligatorios');
        }
        const review = await pool.query(
            "SELECT * FROM reviews WHERE id = $1 AND usuario = $2",
            [id_review, id_user]
        );
        return review.rowCount;
    },

    async createReview(audiolibro, user, comment, puntuacion, visibilidad) {
        const newReview = await pool.query(
            `INSERT INTO reviews (usuario, audiolibro, comentario, puntuacion, visibilidad, fecha) 
                VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, comentario, puntuacion, visibilidad, fecha`,
            [user, audiolibro, comment, puntuacion, visibilidad]
        );
        return newReview.rows[0];
    },

    async editReview(id_review, comment, puntuacion, visibilidad) {
        const editedReview = await pool.query(
            `UPDATE reviews 
            SET comentario = $1, puntuacion = $2, visibilidad = $3, fecha = NOW()
            WHERE id = $4
            RETURNING id, comentario, puntuacion, visibilidad, fecha`,
            [comment, puntuacion, visibilidad, id_review]
        );
        return editedReview.rows[0];
    },

    async deleteReview(id_review) {
        const deletedReview = await pool.query(
            "DELETE FROM reviews WHERE id = $1", [id_review]
        );
        return deletedReview.rowCount;
    },

    async getPublicReviewsOfAudiolibro(id_audiolibro) {
        const reviews = await pool.query(
            `SELECT r.id, u.id AS user_id, u.username, r.comentario, r.puntuacion, r.fecha 
            FROM reviews r JOIN users u ON r.usuario = u.id
            WHERE r.audiolibro = $1 AND r.visibilidad = '0'`,
            [id_audiolibro]
        );
        return reviews.rows;
    },

    async getFriendsReviewsOfAudiolibro(id_audiolibro, user_id) {
        const reviews = await pool.query(
            `SELECT r.id, u.id AS user_id, u.username, r.comentario, r.puntuacion, r.fecha 
            FROM reviews r JOIN users u ON r.usuario = u.id
            WHERE r.audiolibro = $1 
            AND NOT r.visibilidad = '2' 
            AND u.id IN (
                SELECT CASE 
                    WHEN user1 = $2 THEN user2 
                    ELSE user1 
                    END AS friend_id
                FROM amigos
                WHERE user1 = $2 OR user2 = $2
            )`,
            [id_audiolibro, user_id]
        );
        return reviews.rows;
    },

    async getOwnReviewOfAudiolibro(id_audiolibro, user_id) {
        const review = await pool.query(
            `SELECT id, comentario, puntuacion, visibilidad, fecha 
            FROM reviews 
            WHERE audiolibro = $1 AND usuario = $2`,
            [id_audiolibro, user_id]
        );
        if (review.rows.length === 0) {
            return {};
        } else {
            return review.rows[0];
        }
    }

};

module.exports = ReviewModel;
