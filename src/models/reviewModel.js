const pool = require('../db');
const bcrypt = require("bcrypt");

const ReviewModel = {

    async reviewBelongsToUser(id_review, id_user) {
        // Verificar si id_review es nulo o no está definido
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
                VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, comentario, puntuacion, fecha`,
            [user, audiolibro, comment, puntuacion, visibilidad]
        );
        console.log(newReview);
        return newReview.rows[0];
    },

    async editReview(id_review, comment, puntuacion, visibilidad) {
        const editedReview = await pool.query(
            `UPDATE reviews SET comentario = $1, puntuacion = $2, visibilidad = $3 WHERE id = $4
            RETURNING id, comentario, puntuacion, fecha`,
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
module.exports = ReviewModel;
