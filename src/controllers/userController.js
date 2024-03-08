const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        const existingUser = await UserModel.getUserByUsername(username);
        const existingMail = await UserModel.getUserByMail(mail);
        if (existingUser) {
            return res.status(409).json({ 
                error: "Existing username" 
            });
        } else if (existingMail) {
            return res.status(409).json({ 
                error: "Existing email"
            });
        }

        const newUser = await UserModel.createUser(username, mail, password);
        res.status(200).json({
            message: "OK", newUser
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
            message: "OK", user: req.session.user 
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
    const { username } = req.session.user;

    try {
        const user = await UserModel.getUserByUsername(username);

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (passwordMatch) {
                UserModel.changePass(username, newPassword);
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