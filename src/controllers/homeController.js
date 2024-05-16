const MarcapaginasModel = require("../models/marcapaginasModel");

exports.getHome = async (req, res) => {
    const { user_id } = req.session.user;

    try {
        const ultimo = await MarcapaginasModel.getUltimoAudiolibro(user_id);
        
        const seguir_escuchando = await MarcapaginasModel.getSeguirEscuchando(user_id);
        
        res.status(200).json({
            message: "OK",
            ultimo,
            seguir_escuchando
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
