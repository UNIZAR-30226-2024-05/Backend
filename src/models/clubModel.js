const pool = require('../db');

const clubesModel = {

    async CrearClub(nombre, audiolibro,descripcion,owner) {
        try {
            const newClub = await pool.query(
            `INSERT INTO club_lectura (nombre, audiolibro, descripcion, adminn) VALUES ($1, $2,$3,$4) 
            RETURNING id, nombre, descripcion, (SELECT true) AS isAdmin, (SELECT true) AS isMember,
                        (SELECT json_build_object(
                            'id', a.id,
                            'titulo', a.titulo,
                            'img', a.img )
                        FROM audiolibros 
                        WHERE id = $2
                        ) AS audiolibro`
            , [nombre, audiolibro,descripcion,owner]);
            return newClub.rows[0];
        } catch (error) {
            console.error("Error al crear el club de lectura:", error);
            throw error;
        }
    },

    async BorrarClub(id) {
        try {
            const borrado = await pool.query(`DELETE FROM club_lectura WHERE id = $1;
            `, [id]);
            return borrado.rows[0];
        } catch (error) {
            console.error("Error al borrar el club de lectura:", error);
            throw error;
        }
    },

    async getClubByID(id) {
        try {
            const club = await pool.query(`SELECT c.*, a.id AS id_audiolibro, a.titulo, a.img 
                FROM club_lectura c LEFT JOIN audiolibros a ON c.audiolibro = a.id
                WHERE c.id = $1;
            `, [id]);
            return club.rows[0];
        } catch (error) {
            console.error("Error al obtener los datos del club de lectura:", error);
            throw error;
        }
    },

    async unirseAlClub(idUsuario, idClub) {
        try {
            const resultado = await pool.query(`
                INSERT INTO miembros_club (club, usuario) VALUES ($1, $2);
            `, [idClub, idUsuario]);
            return resultado.rows[0];
        } catch (error) {
            console.error("Error al unir al usuario al club:", error);
            throw error;
        }
    },

    async salirseDelClub(idUsuario, idClub) {
        try {
            const resultado = await pool.query(`
                DELETE FROM miembros_club
                WHERE usuario = $1 AND club = $2;
            `, [idUsuario, idClub]);
            return resultado.rowCount;
        } catch (error) {
            console.error("Error al salirse del club:", error);
            throw error;
        }
    },

    async verificarMembresia(idUsuario, idClub) {
        try {
            const resultado = await pool.query(`
                SELECT *
                FROM miembros_club
                WHERE club = $1 AND usuario = $2;
            `, [idClub, idUsuario]);
            
            return resultado.rowCount;
        } catch (error) {
            console.error("Error al verificar la membresía del usuario en el club:", error);
            throw error;
        }
    },
    async obtenerMiembrosClub(idClub) {
        try {
            const resultado = await pool.query(`
                SELECT u.id, u.username, u.img,
                    CASE 
                        WHEN (SELECT adminn FROM club_lectura WHERE id = $1) = u.id
                        THEN TRUE
                        ELSE FALSE
                    END AS isAdmin
                FROM miembros_club mc
                JOIN users u ON mc.usuario = u.id
                WHERE mc.club = $1;
            `, [idClub]);      
            return resultado.rows;
        } catch (error) {
            console.error("Error al obtener los miembros del club:", error);
            throw error;
        }
    },

    async getClubesOfUser(user_id) {
        try {
            const listaClubes = await pool.query(
                `SELECT c.id, c.nombre, c.descripcion, (SELECT true) AS isMember, 
                    (SELECT json_build_object(
                        'id', a.id,
                        'titulo', a.titulo,
                        'img', a.img )
                    ) AS audiolibro,
                    CASE 
                        WHEN c.adminn = $1 THEN TRUE 
                        ELSE FALSE 
                    END AS isAdmin
                FROM club_lectura c 
                INNER JOIN audiolibros a ON c.audiolibro = a.id
                INNER JOIN miembros_club m ON c.id = m.club 
                WHERE m.usuario = $1`,
                [user_id]);
            return listaClubes.rows;
        } catch (error) {
            console.error("Error obteniendo la lista de clubes: ", error);
        }
    },

    async getClubesNotOfUser(user_id) {
        try {
            const listaClubes = await pool.query(
                `SELECT c.id, c.nombre, c.descripcion, (SELECT false) AS isAdmin, (SELECT false) AS isMember,
                    (SELECT json_build_object(
                        'id', a.id,
                        'titulo', a.titulo,
                        'img', a.img )
                    ) AS audiolibro
                FROM club_lectura c 
                LEFT JOIN audiolibros a ON c.audiolibro = a.id
                INNER JOIN miembros_club m ON c.id = m.club 
                WHERE c.id NOT IN (SELECT c.id FROM club_lectura c INNER JOIN miembros_club m ON c.id = m.club 
                                    WHERE m.usuario = $1)`,
                [user_id]);
            return listaClubes.rows;
        } catch (error) {
            console.error("Error obteniendo la lista de clubes: ", error);
        }
    },

    async getMessagesOfClub(club_id) {
        try {
            const messages = await pool.query(
                `SELECT m.id, m.usuario AS user_id, u.username, mensaje, fecha
                FROM mensajes m LEFT JOIN users u ON m.usuario = u.id
                WHERE m.club = $1
                ORDER BY m.fecha ASC`,
                [club_id]);
            return messages.rows;
        } catch (error) {
            console.error("Error obteniendo los mensajes de un club: ", error);
        }
    },

    async addMessage(user_id, club_id, msg) {
        try {
            const message = await pool.query(
                `INSERT INTO (club, usuario, mensaje, fecha) VALUES ($1, $2, $3, NOW())
                RETURNING club, usuario AS user_id, SELECT username FROM users WHERE id = $2, mensaje, fecha`,
                [club_id, user_id, msg]);
            return message.row[0];
        } catch (error) {
            console.error("Error obteniendo los mensajes de un club: ", error);
        }
    }
    
    
};


module.exports = clubesModel;