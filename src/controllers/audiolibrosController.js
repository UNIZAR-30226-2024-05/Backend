const AudiolibrosModel = require("../models/audiolibrosModel");
const AutoresModel = require("../models/autoresModel");
const ReviewModel = require("../models/reviewModel");
const MarcapaginasModel = require("../models/marcapaginasModel");
const ColeccionesModel = require("../models/coleccionesModel");

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

exports.getAudiolibroById = async (req, res) => {
    const { id } = req.params;
    const { boolAuthenticated } = req.hasSession;

    try {
        // Recoger datos generales
        let audiolibro = await AudiolibrosModel.getAudiolibroById(id);
        if (!audiolibro) {
            return res.status(409).json({ 
                error: "Audiolibro doesn't exist"
            });
        }
        const autor = await AutoresModel.getAutorBasicoByID(audiolibro.autor);
        delete audiolibro.autor;
        const generos = await AudiolibrosModel.getGenerosOfAudiolibro(id);
        const capitulos = await AudiolibrosModel.getCapitulosOfAudiolibro(id);
        const publicReviews = await ReviewModel.getPublicReviewsOfAudiolibro(id);
        var friendsReviews = [];
        var ownReview = {};
        var ultimoMomento = {};
        var mpPersonalizados = [];
        var colecciones = [];

        if (boolAuthenticated) {
            // Está registrado, recoger datos relativos al usuario
            const { user_id } = req.session.user;
            friendsReviews = await ReviewModel.getFriendsReviewsOfAudiolibro(id, user_id);
            ownReview = await ReviewModel.getOwnReviewOfAudiolibro(id, user_id);
            ultimoMomento = await MarcapaginasModel.getUltimoMomentoByAudiolibro(user_id, id);
            mpPersonalizados = await MarcapaginasModel.getMarcapaginasPersonalizadosByAudiolibro(user_id, id);
            colecciones = await ColeccionesModel.audiolibroPerteneceColecciones(id, user_id);

        }

        // Construir y mandar el json final
        res.status(200).json({
            audiolibro: audiolibro,
            autor: autor,
            generos: generos,
            capitulos: capitulos,
            public_reviews: publicReviews,
            friends_reviews: friendsReviews,
            own_review: ownReview,
            ultimo_momento: ultimoMomento,
            mp_personalizados: mpPersonalizados,
            colecciones: colecciones
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};