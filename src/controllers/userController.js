const UserModel = require("../models/userModel");
const ColeccionesModel = require("../models/coleccionesModel");
const AmistadModel = require("../models/amistadModel");
const MarcapaginasModel = require("../models/marcapaginasModel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        const existingUser = await UserModel.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ 
                error: "Existing username"
            });
        }
        
        const existingMail = await UserModel.getUserByMail(mail);
        if (existingMail) {
            return res.status(409).json({ 
                error: "Existing email"
            });
        }
        const randomImg = (Math.floor(Math.random() * 10)).toString();
        const user_id = await UserModel.createUser(username, mail, password, randomImg); 
        await ColeccionesModel.createUserCollection('Favoritos', user_id);
        await ColeccionesModel.createUserCollection('Escuchar mas tarde', user_id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ 
                error: "Usuario no encontrado"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: "Contraseña incorrecta"
            });
        } else {
            if (user.admin) {
                req.session.user = { user_id: user.id, role: 'admin' };
            } else {
                req.session.user = { user_id: user.id, role: 'normal' };
            }
        }

        res.status(200).json({ 
            message: "OK", user: { username, img: user.img }
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.logout = async (req, res) => {
    req.session.reset();
    return res.json({
        message: 'Closed session'
    });
    
};

exports.changePass = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { user_id } = req.session.user;

    try {
        const user = await UserModel.getUserById(user_id);

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (passwordMatch) {
                await UserModel.changePass(user_id, newPassword);
                return res.status(200).json({
                    message: "Password changed"
                });
            } else {
                return res.status(401).json({
                    error: "Incorrect password"
                });
            }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.changeImg = async (req, res) => {
    const { newImg } = req.body;
    const { user_id } = req.session.user;

    try {
        await UserModel.changeImg(user_id, newImg);
        res.status(200).json({ 
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.profile = async (req, res) => {
    const { user_id } = req.session.user;

    try {
        const user = await UserModel.getUserById(user_id);
        return res.status(200).json({
            username: user.username,
            mail: user.mail,
            img: user.img
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

};

exports.anyUserProfile = async (req, res) => {
    const boolAuthenticated = req.hasSession;
    const { other_id } = req.params;

    try {
        respuesta = {};
        const user = await UserModel.getUserById(other_id);
        const colecciones = await ColeccionesModel.getUserCollections(other_id);

        //id, username, img, colecciones
        respuesta.id = user.id;
        respuesta.username = user.username;
        respuesta.img = user.img;
        respuesta.colecciones = colecciones;

        if (boolAuthenticated) {
            const { user_id } = req.session.user;
            var estado = 1;
            if (await AmistadModel.hayAmistad(user_id, other_id)) {
                estado = 0;
            } else if (await AmistadModel.hayPeticionPendienteEnviada(user_id, other_id)) {
                estado = 2;
            } else if (await AmistadModel.hayPeticionPendienteRecibida(user_id, other_id)) {
                estado = 3;
            }
            respuesta.estado = estado;
        }
        if (estado == 0) {
            respuesta.ultimo = await MarcapaginasModel.getUltimoAudiolibro(other_id);
        }
        return res.status(200).json(
            respuesta
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};