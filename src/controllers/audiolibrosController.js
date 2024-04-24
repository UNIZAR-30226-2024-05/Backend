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
    const boolAuthenticated = req.hasSession;

    try {
        // Recoger datos generales
        let respuesta = {}
        let audiolibro = await AudiolibrosModel.getAudiolibroById(id);
        if (!audiolibro) {
            return res.status(409).json({ 
                error: "Audiolibro doesn't exist"
            });
        }
        delete audiolibro.autor;
        respuesta.audiolibro = audiolibro;
        respuesta.autor = await AutoresModel.getAutorBasicoByID(audiolibro.autor);
        respuesta.generos = await AudiolibrosModel.getGenerosOfAudiolibro(id);
        respuesta.capitulos = await AudiolibrosModel.getCapitulosOfAudiolibro(id);
        respuesta.public_reviews = await ReviewModel.getPublicReviewsOfAudiolibro(id);

        if (boolAuthenticated) {
            // Está registrado, recoger datos relativos al usuario
            const { user_id } = req.session.user;
            respuesta.friends_reviews = await ReviewModel.getFriendsReviewsOfAudiolibro(id, user_id);
            respuesta.own_review = await ReviewModel.getOwnReviewOfAudiolibro(id, user_id);
            console.log(await ReviewModel.getOwnReviewOfAudiolibro(id, user_id));
            respuesta.ultimo_momento = await MarcapaginasModel.getUltimoMomentoByAudiolibro(user_id, id);
            respuesta.mp_personalizados = await MarcapaginasModel.getMarcapaginasPersonalizadosByAudiolibro(user_id, id);
            respuesta.colecciones = await ColeccionesModel.audiolibroPerteneceColecciones(id, user_id);

        }

        // Construir y mandar el json final
        res.status(200).json(
            respuesta
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};