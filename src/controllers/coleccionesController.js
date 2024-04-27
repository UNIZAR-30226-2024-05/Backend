const ColeccionesModel = require("../models/coleccionesModel");

exports.getUserCollections = async (req, res) => {
    const { user_id } = req.session.user;
    
    try {
        const collections = await ColeccionesModel.getUserCollections(user_id);
        res.status(200).json({
            message: "OK", collections
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getInfoCollection = async (req, res) => {
    const { user_id } = req.session.user;
    const { coleccionId } = req.params;
    
    try {
        const coleccion = await ColeccionesModel.getColeccionById(coleccionId);
        if (!coleccion) {
            return res.status(409).json({ 
                error: "Coleccion no encontrada"
            });
        }

        const propietario = await ColeccionesModel.getCollectionOwnerName(coleccionId);
        const guardada = await ColeccionesModel.coleccionGuardada(user_id, coleccionId);
        const audiolibros = await ColeccionesModel.getAudiolibrosColeccion(coleccionId);
        res.status(200).json({
            message: "OK", coleccion, propietario, guardada, audiolibros
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.createUserCollection = async (req, res) => {
    const { user_id } = req.session.user;
    const { title } = req.body;

    try {
        await ColeccionesModel.createUserCollection(title, user_id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).send("Título existente");
        } else {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
};

exports.removeCollection = async (req, res) => {
    const { user_id } = req.session.user;
    const { collectionId } = req.body;

    try {
        const collectionOwner = await ColeccionesModel.getCollectionOwnerName(collectionId);
        if (collectionOwner.id == user_id) {
            await ColeccionesModel.deleteUserCollection(collectionId);
        } else {
            await ColeccionesModel.removeFriendCollection(collectionId, user_id);
        }

        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.addfriendCollection = async (req, res) => {
    const { user_id } = req.session.user;
    const { collectionId } = req.body;

    try {
        await ColeccionesModel.addFriendCollection(collectionId, user_id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.addAudiolibroColeccion = async (req, res) => {
    const { user_id } = req.session.user;
    const { audiolibroId, coleccionId } = req.body;

    try {
        const ok = await ColeccionesModel.addAudiolibroColeccion(audiolibroId, coleccionId, user_id);
        if (ok) {
            res.status(200).json({
                message: "OK"
            });
        } else {
            res.status(400).send("No propietario");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeAudiolibroColeccion = async (req, res) => {
    const { user_id } = req.session.user;
    const { audiolibroId, coleccionId } = req.body;

    try {
        const ok = await ColeccionesModel.removeAudiolibroColeccion(audiolibroId, coleccionId, user_id);
        if (ok) {
            res.status(200).json({
                message: "OK"
            });
        } else {
            res.status(400).send("No propietario");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
