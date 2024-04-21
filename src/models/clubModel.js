const pool = require('../db');

const clubesModel = {

    async CrearClub(nombre, audiolibro,descripcion,owner) {
        try {
            const newClub = await pool.query(
            "INSERT INTO club_lectura (nombre, audiolibro, descripcion, owner) VALUES ($1, $2,$3,$4)"
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
            const club = await pool.query(`SELECT DISTINCT club_lectura.*
            FROM club_lectura
            WHERE   club_lectura.id = $1;
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
            
            return resultado.rows[0];
        } catch (error) {
            console.error("Error al verificar la membresía del usuario en el club:", error);
            throw error;
        }
    },
    async obtenerMiembrosClub(idClub) {
        try {
            const resultado = await pool.query(`
                SELECT u.username
                FROM miembros_club mc
                JOIN users u ON mc.usuario = u.id
                WHERE mc.club = $1;
            `, [idClub]);      
            return resultado.rows;
        } catch (error) {
            console.error("Error al obtener los miembros del club:", error);
            throw error;
        }
    }
    
    
};


module.exports = clubesModel;