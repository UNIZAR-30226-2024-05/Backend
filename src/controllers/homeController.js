const MarcapaginasModel = require("../models/marcapaginasModel");

exports.getHome = async (req, res) => {
    const { user_id } = req.body;

    try {
        const ultimo = await MarcapaginasModel.getUltimoAudiolibro(user_id);
        
        const seguir_escuchando = await UserModel.getUserByMail(mail);
        
        res.status(200).json({
            message: "OK",
            ultimo: ultimo,
            seguir_escuchando: seguir_escuchando
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
