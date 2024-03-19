const marcapaginasModel = require("../models/marcapaginasModel");
const userModel = require("../models/userModel");

exports.getUltimoAudiolibro = async (req, res) => {
    const { username } = req.params;
    try { 
        const audiolibro = await marcapaginasModel.getUltimoAudiolibro(username);
        if (!audiolibro) {
            return res.status(404).json({ 
                error: "Ultimo audiolibro no encontrado"
            });
        }
        return res.status(200).json({
            img: audiolibro.img,
            tiempo: audiolibro.fecha,
            audiolibro: audiolibro.audiolibro,
            numero: audiolibro.numero,
            audio: audiolibro.audio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.crearMarcapaginas = async (req, res) => {
    const { titulo, capitulo, tiempo } = req.body;
    const { username } = req.session.user;
    try {
        user = await userModel.getUserByUsername(username);
        userID = user.id;
        const newMarcapaginas = await marcapaginasModel.CrearMarcapaginas(userID, titulo,capitulo, tiempo);
        res.status(200).json({
            message: "OK", newMarcapaginas
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.BorrarMarcapaginas = async (req, res) => {
    const { marcapaginasID } = req.body;
    const { username } = req.session.user;
    
    try {
        user = await userModel.getUserByUsername(username);
        userID = user.id;
        const existingMarcapaginas = await marcapaginasModel.getMarcapaginasByID(marcapaginasID);
        const pertenece = await marcapaginasModel.getMarcapaginasByID_User(marcapaginasID,userID);
        if (!existingMarcapaginas) {
            return res.status(404).json({ 
                error: "Not found" 
            });
        } else if (!pertenece) {
            return res.status(403).json({ 
                error: "No le pertenece el marcapaginas"
            });
        }
        const Borrado = await marcapaginasModel.BorrarMarcapaginas(marcapaginasID);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.ActualizarMarcapaginas = async (req, res) => {
    const { marcapaginasID, titulo, capitulo, tiempo } = req.body;
    const { username } = req.session.user;
    tituloprob = titulo;
    capituloprob = capitulo;
    tiempoprob = tiempo;
    try {
        user = await userModel.getUserByUsername(username);
        userID = user.id;
        const existingMarcapaginas = await marcapaginasModel.getMarcapaginasByID(marcapaginasID);
        const pertenece = await marcapaginasModel.getMarcapaginasByID_User(marcapaginasID,userID);
        if (!existingMarcapaginas) {
            return res.status(404).json({ 
                error: "Not found" 
            });
        } else if (!pertenece) {
            return res.status(403).json({ 
                error: "No le pertenece el marcapaginas"
            });
        }
        if (titulo ==null|| titulo == ""){
            tituloprob = pertenece.titulo
        }

        if (capitulo ==null|| capitulo == ""){
            capituloprob = pertenece.capitulo
        }
        if (tiempo ==null|| tiempo == ""){
            tiempoprob = pertenece.fecha
        }
        const Borrado = await marcapaginasModel.ActualizarMarcapaginas(marcapaginasID,tituloprob,tiempoprob, capituloprob);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};