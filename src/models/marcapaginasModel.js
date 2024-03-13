const pool = require('../db');

const marcapaginasModel = {
    async getUltimoAudiolibro(username) {
        try {
            const audiolibros = await pool.query(`SELECT DISTINCT audiolibros.*, capitulos.*, marcapaginas.*
            FROM audiolibros
            JOIN capitulos ON audiolibros.id = capitulos.audiolibro
            JOIN marcapaginas ON capitulos.id = marcapaginas.capitulo
            JOIN users ON marcapaginas.usuario = users.id
            WHERE  marcapaginas.tipo = '0' AND users.username = $1;
            `, [username]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al obtener el ultimo audiolibro del usuario:", error);
            throw error;
        }
    }
};

module.exports = marcapaginasModel;