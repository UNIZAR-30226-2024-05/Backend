const pool = require('../services/db');

const autoresModel = {
    async getAutorByName(name) {
        const autor = await pool.query("SELECT * FROM autores WHERE nombre = $1", [name]);
        return autor.rows[0];
    }
};

module.exports = autoresModel;
