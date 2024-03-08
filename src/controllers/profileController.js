const AudiolibrosModel = require("../models/audiolibrosModel");

exports.getProfileByUsername = async (req, res) => {
    const { username } = req.params;

    try {

        // Recoger datos generales

        if (isFriend) {
            // Es amigo, recoger datos visibles solo por los amigos
        }

        // Construir y mandar el json final

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};