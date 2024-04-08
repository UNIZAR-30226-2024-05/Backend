const AudiolibrosModel = require("../models/audiolibrosModel");

exports.getAllAudiolibros = async (req, res) => {    
    try {
        const audiolibros = await AudiolibrosModel.getAllAudiolibros();
        res.status(200).json({
            message: "OK", audiolibros
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getAudiolibrosByGenero = async (req, res) => {
    const { genero } = req.params;

    try {
        const audiolibros = await AudiolibrosModel.getAudiolibroByGenero(genero);
        res.status(200).json(audiolibros);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};