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
        const autor = await AutoresModel.getAutor(nombreAutor);
        const audiolibro = await AudiolibrosModel.newAudiolibro(titulo, autor.id, descripcion, imgUrl);
        if (!audiolibro) {
            res.status(409).json({ error: "Audiolibro existente" });
            return;
        }

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

exports.deleteAudiolibro = async (req, res) => {
    const { audiolibroId } = req.body;

    try {
        const audiolibro = await AudiolibrosModel.getAudiolibroById(audiolibroId);
        if (!audiolibro) {
            return res.status(409).json({ 
                error: "Audiolibro doesn't exist"
            });
        }

        const imgName = audiolibro.img.substring(audiolibro.img.lastIndexOf('/') + 1);
        await AzureBlobStorage.deleteImgFromAzureBlobStorage(imgName);

        const capitulos = await AudiolibrosModel.getCapitulosOfAudiolibro(audiolibroId);
        capitulos.forEach(async (capitulo) => {
            const audioName = capitulo.audio.substring(capitulo.audio.lastIndexOf('/') + 1);
            await AzureBlobStorage.deleteAudioFromAzureBlobStorage(audioName);
        })

        await AudiolibrosModel.deleteAudiolibro(audiolibroId);

        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.updateAudiolibro = async (req, res) => {
    const { audiolibroId, titulo, nombreAutor, descripcion, audiosUrls } = req.body;
    let imgUrl = req.body;
    const { image, audios } = req.files;

    try {
        const audiolibro = await AudiolibrosModel.getAudiolibroById(audiolibroId);
        if (!audiolibro) {
            return res.status(409).json({ error: "Audiolibro doesn't exist" });
        }

        if (image && image.length > 0) {
            const imgName = audiolibro.img.substring(audiolibro.img.lastIndexOf('/') + 1);
            await AzureBlobStorage.deleteImgFromAzureBlobStorage(imgName)
            imgUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                image[0].originalname, image[0].buffer, image[0].fieldname, image[0].mimetype
            );
        }

        const autorPeticion = await AutoresModel.getAutor(nombreAutor);
        if (audiolibro.titulo !== titulo || audiolibro.autor !== autorPeticion.id || audiolibro.descripcion !== descripcion 
            || (image && image.length > 0)) {
            await AudiolibrosModel.updateAudiolibro(audiolibroId, titulo, autorPeticion.id, descripcion, imgUrl);
        }

        const capitulosActuales = await AudiolibrosModel.getCapitulosOfAudiolibro(audiolibroId);
        capitulosActuales.forEach(async (capitulo) => {
            if (!audiosUrls || !audiosUrls.includes(capitulo.audio)) {
                await AudiolibrosModel.eliminarCapitulo(audiolibroId, capitulo.audio);
                const audioName = capitulo.audio.substring(capitulo.audio.lastIndexOf('/') + 1);
                await AzureBlobStorage.deleteAudioFromAzureBlobStorage(audioName);
            }
        })

        if (audios && audios.length > 0) {
            let ultimoCapitulo = capitulosActuales[capitulosActuales.length - 1].numero;
            for (let i = 0; i < audios.length; i++) {
                const audio = audios[i];
                const audioUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                    audio.originalname, audio.buffer, audio.fieldname, audio.mimetype
                );
                await AudiolibrosModel.subirCapitulo(audiolibroId, ultimoCapitulo+1, audioUrl);
                ultimoCapitulo++;
            }
        }
        
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
