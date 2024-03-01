const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        const existingUser = await UserModel.getUserByUsername(username);
        const existingMail = await UserModel.getUserByMail(mail);
        if (existingUser) {
            return res.status(409).json({ 
                error: "El nombre de usuaio elegido ya existe. Por favor, seleccione otro" 
            });
        } else if (existingMail) {
            return res.status(409).json({ 
                error: "Existing email"
            });
        }

        const newUser = await UserModel.createUser(username, mail, password);
        res.status(200).json({
            message: "Usuario registrado correctamente", newUser
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
                req.session.user = { username, role: 'admin' };
            } else {
                req.session.user = { username, role: 'normal' };
            }
        }

        res.status(200).json({ 
            message: "Inicio de sesión exitoso", user: req.session.user 
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
