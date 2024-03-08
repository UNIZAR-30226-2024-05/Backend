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

exports.getAudiolibroById = async (req, res) => {
    const { id } = req.params;

    try {

        // Recoger datos generales
        let audiolibro = await AudiolibrosModel.getAudiolibroById(id);
        const autor = await AutorModel.getAutorById(audiolibro.autor); //Falta
        delete audiolibro.autor;
        const generos = await AudiolibrosModel.getGenerosOfAudiolibro(id);
        //Capítulos
        //Reviews públicas

        if (isFriend) {
            // Es amigo, recoger datos relativos al usuario
        }

        // Construir y mandar el json final

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};