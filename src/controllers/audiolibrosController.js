const AudiolibrosModel = require("../models/audiolibrosModel");
const AzureBlobStorage = require("../services/azureBlobStorage");

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

exports.newAudiolibro = async (req, res) => {
    const { titulo, autorId, descripcion, imgPath } = req.body;

    try {
        const imgUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(imgPath, titulo+autorId);
        await AudiolibrosModel.newAudiolibro(titulo, autorId, descripcion, imgUrl);
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.deleteAudiolibro = async (req, res) => {
    const { audiolibroId } = req.body;

    try {
        const audiolibros = await AudiolibrosModel.getAudiolibroById(audiolibroId);
        await AzureBlobStorage.deleteBlobFromAzureBlobStorage(audiolibros.titulo+audiolibros.autor);
        await AudiolibrosModel.deleteAudiolibro(audiolibroId);
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
