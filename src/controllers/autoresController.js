const autoresModel = require("../models/autoresModel");

exports.CrearAutor = async (req, res) => {
    const { nombre, info} = req.body;
    existe = await autoresModel.getAutor(nombre);
    if (existe){
        return res.status(409).json({ 
            error: "Existing autor" 
        });
    }
    try {
        const newAutor = await autoresModel.CrearAutor(nombre, info);
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
    const { id, nombre, info } = req.body;
    try {
        existe = await autoresModel.getAutorByID(id);
        if (!existe){
            return res.status(404).json({ 
                error: "Not Existing autor" 
            });
        }
    const actualizar = await autoresModel.ActualizarAutor(id, nombre,info);
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
        existe = await autoresModel.getAutorByID(id);
        if (!existe){
            return res.status(404).json({ 
                error: "Not Existing autor" 
            });
        }
    
    //obtener datos 

    //mandar respuesta correcta
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


Base de datos:

nombre
wikipedia
fecha nacimiento
foto del autor
----------------------------
Consultas extra
-media nota reviews de sus audiolibros
-Genero mas escrito