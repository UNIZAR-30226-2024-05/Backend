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
    },

    async CrearMarcapaginas(userID, titulo, capitulo, tiempo) {
        try {
            const newMarcapaginas = await pool.query(
            "INSERT INTO marcapaginas (usuario, titulo, capitulo, fecha, tipo) VALUES ($1, $2, $3, $4, 2)"
            , [userID, titulo, capitulo, tiempo]);
            return newMarcapaginas.rows[0];
        } catch (error) {
            console.error("Error al crear el marcapaginas:", error);
            throw error;
        }
    },

    async BorrarMarcapaginas(id) {
        try {
            const borrado = await pool.query(`DELETE FROM marcapaginas WHERE id = $1;
            `, [id]);
            return borrado.rows[0];
        } catch (error) {
            console.error("Error al borrar el marcapaginas del usuario:", error);
            throw error;
        }
    },

    async ActualizarMarcapaginas(id, titulo, tiempo, capitulo) {
        try {
            const audiolibros = await pool.query("UPDATE marcapaginas SET titulo = $2, capitulo = $3, fecha = $4  WHERE id = $1;",
            [id, titulo, capitulo, tiempo]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al actualizar el marcapaginas del usuario:", error);
            throw error;
        }
    },

    async getAudiolibrosEmpezados(username) {
        try {
            const audiolibros = await pool.query(`SELECT DISTINCT audiolibros.*, capitulos.*, marcapaginas.*
            FROM audiolibros
            JOIN capitulos ON audiolibros.id = capitulos.audiolibro
            JOIN marcapaginas ON capitulos.id = marcapaginas.capitulo
            JOIN users ON marcapaginas.usuario = users.id
            WHERE  marcapaginas.tipo = '1' AND users.username = $1;
            `, [username]);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener el ultimo audiolibro del usuario:", error);
            throw error;
        }
    },
    async getAllMarcapaginasPersonalizados(username) {
        try {
            const audiolibros = await pool.query(`SELECT DISTINCT audiolibros.*, capitulos.*, marcapaginas.*
            FROM audiolibros
            JOIN capitulos ON audiolibros.id = capitulos.audiolibro
            JOIN marcapaginas ON capitulos.id = marcapaginas.capitulo
            JOIN users ON marcapaginas.usuario = users.id
            WHERE  marcapaginas.tipo = '2' AND users.username = $1;
            `, [username]);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener el ultimo audiolibro del usuario:", error);
            throw error;
        }
    },
    async getMarcapaginasPersonalizadosByAudiolibro(username, audiobookId) {
        try {
            const audiolibros = await pool.query(`
                SELECT DISTINCT audiolibros.*, capitulos.*, marcapaginas.*
                FROM audiolibros
                JOIN capitulos ON audiolibros.id = capitulos.audiolibro
                JOIN marcapaginas ON capitulos.id = marcapaginas.capitulo
                JOIN users ON marcapaginas.usuario = users.id
                WHERE marcapaginas.tipo = '2' AND users.username = $1 AND capitulos.audiolibro = $2;
            `, [username, audiobookId]);
            return audiolibros.rows;
        } catch (error) {
            console.error("Error al obtener el último audiolibro del usuario:", error);
            throw error;
        }
    },
    async getMarcapaginasByID(ID) {
        const marcapaginas = await pool.query("SELECT * FROM marcapaginas WHERE id = $1;", [ID]);
        return marcapaginas.rows[0];
    },
    async CrearUltimoAudiolibro(userID, titulo,capitulo, tiempo) {
        try {
            const newMarcapaginas = await pool.query(
            "INSERT INTO marcapaginas (usuario, titulo, capitulo, fecha, tipo) VALUES ($1, $2, $3, $4, 0)"
            , [userID, titulo, capitulo, tiempo]);
            return newMarcapaginas.rows[0];
        } catch (error) {
            console.error("Error al guardar el ultimo audiolibro:", error);
            throw error;
        }
    },
    async getMarcapaginasByID_User(ID, userID) {
        const marcapaginas = await pool.query("SELECT * FROM marcapaginas WHERE id = $1 AND usuario = $2;", [ID, userID]);
        return marcapaginas.rows[0];
    },
    async ExistiaAudiolibroEmpezadoByAudiolibro(audiolibroID, usuarioID) {
        try {
            const marcapagina = await pool.query(
                `SELECT m.*, c.* 
                FROM marcapaginas m 
                JOIN capitulos c ON m.capitulo = c.id 
                WHERE m.tipo = '1' AND c.audiolibro = $1 AND m.usuario = $2;`,
                [audiolibroID, usuarioID]
            );
            return marcapagina.rows[0];
        } catch (error) {
            console.error("Error al obtener el marcapágina:", error);
            throw error;
        }
    },
    async CambiarUltimoMarcapaginas(id) {
        try {
            const audiolibros = await pool.query("UPDATE marcapaginas SET tipo =1  WHERE id = $1;",
            [id]);
            return audiolibros.rows[0];
        } catch (error) {
            console.error("Error al actualizar el antiguo ultimo audiolibro:", error);
            throw error;
        }
    },
    async AudiolibroDelCapitulo(capitulo) {
        const audiolibroPorCapitulo = await pool.query("SELECT * FROM capitulos WHERE id = $1;", [capitulo]);
        return audiolibroPorCapitulo.rows[0];
    }
};
module.exports = marcapaginasModel;