const autoresModel = require("../models/autoresModel");

exports.CrearAutor = async (req, res) => {
    const { nombre, info, ciudad} = req.body;
    existe = await autoresModel.getAutor(nombre);
    if (existe){
        return res.status(409).json({ 
            error: "Existing autor" 
        });
    }
    try {
        const newAutor = await autoresModel.CrearAutor(nombre, info,ciudad);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.BorrarAutor = async (req, res) => {
    const { id } = req.body;
    try {
        existe = await autoresModel.getAutorByID(id);
        if (!existe){
            return res.status(404).json({ 
                 error: "Not Existing autor" 
             });
        }
        const Borrado = await autoresModel.BorrarAutor(id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.ActualizarAutor = async (req, res) => {
    const { id, nombre, info, ciudad  } = req.body;
    try {
        existe = await autoresModel.getAutorByID(id);
        if (!existe){
            return res.status(404).json({ 
                error: "Not Existing autor" 
            });
        }
        duplicado = await autoresModel.getAutor(nombre);
        if (duplicado && duplicado.id != existe.id){
            return res.status(409).json({ 
                error: "Estas modificando el nombre a un autor ya existente" 
            });
        }
    const actualizar = await autoresModel.ActualizarAutor(id, nombre,info,ciudad);
    res.status(200).json({
        message: "OK"
    }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getDatosAutor = async (req, res) => {
    const { id } = req.params;
    try {
        autor = await autoresModel.getAutorByID(id);
        if (!autor){
            return res.status(404).json({ 
                error: "Not Existing autor" 
            });
        }
        audiolibros = await autoresModel.getAudiolibrosPorAutor(id); 
        genero = await autoresModel.getGeneroMasEscrito(id);
        NotaMedia = await autoresModel.getPuntuacionMediaAutor(id);
        NotaMedia = Math.round(NotaMedia.media_puntuacion * 100) / 100;
        res.status(200).json({ autor, NotaMedia,generoMasEscrito: genero.genero, audiolibros});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
