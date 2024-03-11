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


exports.getAudiolibrosByNombre = async (req, res) => {
    const { nombre } = req.params;
    try { 
        const audiolibros = await AudiolibrosModel.getAudiolibroByNombre(nombre);
        res.status(200).json(audiolibros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getUltimoAudiolibro = async (req, res) => {
    const { username } = req.params;
    try { 
        const audiolibro = await AudiolibrosModel.getUltimoAudiolibro(username);
        if (!audiolibro) {
            return res.status(404).json({ 
                error: "Ultimo audiolibro no encontrado"
            });
        }
        return res.status(200).json({
            img: audiolibro.img,
            tiempo: audiolibro.fecha,
            audiolibro: audiolibro.audiolibro,
            numero: audiolibro.numero,
            audio: audiolibro.audio,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};