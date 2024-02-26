const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        const existingUser = await UserModel.getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ 
                error: "El nombre de usuaio elegido ya existe. Por favor, seleccione otro" 
            });
        }

        const newUser = await UserModel.createUser(username, mail, password);
        res.status(200).json(newUser);
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

        // Debería haber una mejor forma de hacerlo pero para tener un admin por defecto en la bd,
        // como no tiene la contraseña cifrada
        let passwordMatch;
        if (username == "defaultAdmin") {
            passwordMatch = user.password;
        } else {
            passwordMatch = await bcrypt.compare(password, user.password);
        }

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Contraseña incorrecta"
            });
        }

        req.session.user = { username, role: 'normal' };

        res.status(200).json({ 
            message: "Inicio de sesión exitoso", user: req.session.user 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
