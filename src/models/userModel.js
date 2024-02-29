const pool = require('../db');
const bcrypt = require("bcrypt");

const UserModel = {
    async createUser(username, mail, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, mail, password, admin) VALUES ($1, $2, $3, false)",
            [username, mail, hashedPassword]
        );
        return newUser.rows[0];
    },

    async getUserByUsername(username) {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        return user.rows[0];
    },

    async getUserByMail(mail) {
        const user = await pool.query("SELECT * FROM users WHERE mail = $1", [mail]);
        return user.rows[0];
    }
};

module.exports = UserModel;
