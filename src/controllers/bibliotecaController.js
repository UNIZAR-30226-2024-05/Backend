const BibliotecaModel = require("../models/bibliotecaModel");

exports.getUserAudiolibros = async (req, res) => {
    const { username } = req.session.user;
    const collectionTitle = 'Biblioteca';
    
    try {
        const userAudiobooks = await BibliotecaModel.getAudiolibrosColeccion(username, collectionTitle);
        res.status(200).json({
            message: "OK", userAudiobooks
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getUserFavoritos = async (req, res) => {
    const { username } = req.session.user;
    const collectionTitle = 'Favoritos';
    
    try {
        const userAudiobooks = await BibliotecaModel.getAudiolibrosColeccion(username, collectionTitle);
        res.status(200).json({
            message: "OK", userAudiobooks
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getUserCollections = async (req, res) => {
    const { username } = req.session.user;
    
    try {
        const collections = await BibliotecaModel.getUserCollections(username);
        res.status(200).json({
            message: "OK", collections
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getAudiolibrosCollection = async (req, res) => {
    const { username } = req.session.user;
    const { titulo } = req.params;
    
    try {
        const audiolibros = await BibliotecaModel.getAudiolibrosColeccion(username, titulo);
        res.status(200).json({
            message: "OK", audiolibros
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.createUserCollection = async (req, res) => {
    const { username } = req.session.user;
    const { title } = req.body;

    try {
        const newCollection = await BibliotecaModel.createUserCollection(title, username);
        res.status(200).json({
            message: "OK", newCollection
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
    const { username } = req.session.user;
    const { collectionId } = req.body;

    try {
        const collectionOwner = await BibliotecaModel.getCollectionOwner(collectionId);
        if (collectionOwner.username == username) {
            await BibliotecaModel.deleteUserCollection(collectionId);
        } else {
            await BibliotecaModel.removeFriendCollection(collectionId);
        }

        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

exports.addfriendCollection = async (req, res) => {
    const { username } = req.session.user;
    const { collectionId } = req.body;

    try {
        const newCollection = await BibliotecaModel.addFriendCollection(collectionId, username);
        res.status(200).json({
            message: "OK", newCollection
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
