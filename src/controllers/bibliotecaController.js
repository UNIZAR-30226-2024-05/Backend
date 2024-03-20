const BibliotecaModel = require("../models/bibliotecaModel");

exports.getUserAudiolibros = async (req, res) => {
    const { username } = req.session.user;
    const collectionTitle = 'Biblioteca';
    
    try {
        const userAudiobooks = await BibliotecaModel.getAudiolibrosColeccion(username, collectionTitle);
        res.status(200).json({
            message: "OK", userAudiobooks
        });
    } catch (error) {
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
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getUserCollections = async (req, res) => {
    const { username } = req.session.user;
    
    try {
        const collections = await BibliotecaModel.getUserCollections(username);
        const filteredCollections = collections.filter(collection => collection.titulo !== 'Biblioteca' && collection.titulo !== 'Favoritos');
        res.status(200).json({
            message: "OK", filteredCollections
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.createUserCollection = async (req, res) => {
    const { title, owner } = req.body;

    try {
        const newCollection = await BibliotecaModel.createUserCollection(title, owner);
        res.status(200).json({
            message: "OK", newCollection
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteUserCollection = async (req, res) => {
    const { title, owner } = req.body;

    try {
        const deletedCollection = await BibliotecaModel.deleteUserCollection(title, owner);
        res.status(200).json({
            message: "OK", deletedCollection
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

exports.addfriendCollection = async (req, res) => {
    const { title, owner } = req.body;

    try {
        const newCollection = await BibliotecaModel.createUserCollection(title, owner);
        res.status(200).json({
            message: "OK", newCollection
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeFriendCollection = async (req, res) => {
    const { title, owner } = req.body;

    try {
        const deletedCollection = await BibliotecaModel.deleteUserCollection(title, owner);
        res.status(200).json({
            message: "OK", deletedCollection
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}