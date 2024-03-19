const BibliotecaModel = require("../models/bibliotecaModel");

exports.getAllAudiolibros = async (req, res) => {
    const { username } = req.session.user;
    try {
        const userAudiobooks = await AudiobookModel.getUserAudiobooksByUsername(username);
        res.status(200).json(userAudiobooks);
    } catch (error) {
        console.error('Error fetching user audiobooks:', error);
        res.status(500).json({ error: 'Failed to fetch user audiobooks' });
    }
};

exports.createCollection = async (req, res) => {
    const { title, ownerId } = req.body;

    if (!title || !ownerId) {
        return res.status(400).json({ error: "Please provide title and owner id" });
    }

    try {
        const newCollection = await UserModel.createCollection(title, ownerId);
        res.status(201).json(newCollection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create collection" });
    }
};

exports.deleteCollection = async (req, res) => {
    const collectionId = req.params.collectionId;

    try {
        const deletedCollection = await UserModel.deleteCollection(collectionId);
        if (!deletedCollection) {
            return res.status(404).json({ error: "Collection not found" });
        }
        res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete collection" });
    }
}