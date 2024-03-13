const AudiolibrosModel = require("../models/audiolibrosModel");

exports.getAudiolibrosByGenero = async (req, res) => {
    const { genero } = req.params;

    try {
        const audiolibros = await AudiolibrosModel.getAudiolibroByGenero(genero);
        res.status(200).json(audiolibros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


