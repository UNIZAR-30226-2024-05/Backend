const pool = require('../services/db');
const bcrypt = require("bcrypt");

const UserModel = {
    async createUser(username, mail, password, img) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user_id  = await pool.query(
            `INSERT INTO users (username, mail, password, img, admin) VALUES ($1, $2, $3, $4, false)
            RETURNING id`,
            [username, mail, hashedPassword, img]
        );
        return user_id.rows[0].id;
    },

    async getUserById(user_id) {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [user_id]);
        return user.rows[0];
    },

    async getUserByUsername(username) {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        return user.rows[0];
    },

    async getUserByMail(mail) {
        const user = await pool.query("SELECT * FROM users WHERE mail = $1", [mail]);
        return user.rows[0];
    },

    async changePass(user_id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user_id]);
        return updatedUser.rowCount;
    },

    async changeImg(user_id, newImg) {
        const updatedUser = await pool.query("UPDATE users SET img = $1 WHERE id = $2", [newImg, user_id]);
        return updatedUser.rowCount;
    },

    async getUsersExceptOwn(user_id) {
        const list = await pool.query(`SELECT id, username, img FROM users WHERE NOT id = $1 AND admin = false`, [user_id]);
        return list.rows;
    }
};

module.exports = UserModel;
