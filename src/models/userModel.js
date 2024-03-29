const pool = require('../db');
const bcrypt = require("bcrypt");

const UserModel = {
    async createUser(username, mail, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, mail, password, admin) VALUES ($1, $2, $3, false)",
            [username, mail, hashedPassword]
        );
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
    }
};

module.exports = UserModel;
