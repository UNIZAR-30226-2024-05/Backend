const pool = require('../db');
const UserModel = require('./userModel');

const ProfileModel = {
    async getProfileByUsername(username) {
        try {
            const user = UserModel.getUserByUsername(username)
            if (user) {
                // User existe, obtener datos
                const profile = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                return profile.rows[0];
            } else {
                // User no existe
            }
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error);
            throw error;
        }
    }
};

module.exports = ProfileModel;