const AudiolibrosModel = require("../models/audiolibrosModel");
const ReviewModel = require("../models/reviewModel");

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
        const capitulos = await AudiolibrosModel.getCapitulosOfAudiolibro(id);
        const publicReviews = await ReviewModel.getPublicReviewsOfAudiolibro(id);

        if (boolAuthenticated) {
            // Está registrado, recoger datos relativos al usuario
            const { user_id } = req.session.user;
            const friendsReviews = await ReviewModel.getFriendsReviewsOfAudiolibro(id, user_id);
            const ownReviews = await ReviewModel.getOwnReviewOfAudiolibro(id, user_id);

        }

        // Construir y mandar el json final

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};