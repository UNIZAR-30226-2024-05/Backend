const AudiolibrosModel = require("../models/audiolibrosModel");
const AutoresModel = require("../models/autoresModel");
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
    const { titulo, nombreAutor, descripcion } = req.body;
    const { image, audios } = req.files;

    try {
        const imgUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
            image[0].originalname, image[0].buffer, image[0].fieldname, image[0].mimetype
        );
        const autor = await AutoresModel.getAutorByName(nombreAutor);
        const audiolibro = await AudiolibrosModel.newAudiolibro(titulo, autor.id, descripcion, imgUrl);

        for (let i = 0; i < audios.length; i++) {
            const file = audios[i];
            const audioUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                file.originalname, file.buffer, file.fieldname, file.mimetype
            );
            await AudiolibrosModel.subirCapitulo(audiolibro.id, i+1, audioUrl);
        }
        
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

/*
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
*/
