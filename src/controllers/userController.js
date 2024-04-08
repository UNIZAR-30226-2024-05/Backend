const UserModel = require("../models/userModel");
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

        await UserModel.createUser(username, mail, password);
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
                req.session.user = { user_id: user.id, username, role: 'admin' };
            } else {
                req.session.user = { user_id: user.id, username, role: 'normal' };
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

exports.profile = async (req, res) => {
    const { user_id } = req.session.user;

    try {
        const user = await UserModel.getUserById(user_id);
        return res.status(200).json({
            username: user.username,
            mail: user.mail
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

};