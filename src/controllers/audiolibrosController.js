const AudiolibrosModel = require("../models/audiolibrosModel");
const AutoresModel = require("../models/autoresModel");
const ReviewModel = require("../models/reviewModel");
const MarcapaginasModel = require("../models/marcapaginasModel");
const ColeccionesModel = require("../models/coleccionesModel");
const AzureBlobStorage = require("../services/azureBlobStorage");

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
        respuesta.audiolibro = audiolibro;
        respuesta.autor = await AutoresModel.getAutorBasicoByID(audiolibro.autor);
        delete audiolibro.autor;
        respuesta.generos = await AudiolibrosModel.getGenerosOfAudiolibro(id);
        respuesta.capitulos = await AudiolibrosModel.getCapitulosOfAudiolibro(id);
        respuesta.public_reviews = await ReviewModel.getPublicReviewsOfAudiolibro(id);

        if (boolAuthenticated) {
            // Está registrado, recoger datos relativos al usuario
            const { user_id } = req.session.user;
            respuesta.friends_reviews = await ReviewModel.getFriendsReviewsOfAudiolibro(id, user_id);
            respuesta.own_review = await ReviewModel.getOwnReviewOfAudiolibro(id, user_id);
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

exports.newAudiolibro = async (req, res) => {
    const { titulo, nombreAutor, descripcion, genero } = req.body;
    const { image, audios } = req.files;
    let imgUrl, autorId;

    if (!titulo) {
        return res.status(400).json({ 
            error: "Título obligatorio"
        });
    }

    try {
        if (image && image.length > 0) {
            imgUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                image[0].originalname, image[0].buffer, image[0].fieldname, image[0].mimetype
            );
        }

        if (nombreAutor) {
            const autor = await AutoresModel.getAutor(nombreAutor);
            if (!autor) {
                return res.status(404).json({ 
                    error: "Autor no existente"
                });
            }
            autorId = autor.id;
        }

        const audiolibro = await AudiolibrosModel.newAudiolibro(titulo, autorId, descripcion, imgUrl);
        if (!audiolibro) {
            res.status(409).json({ error: "Audiolibro existente" });
            return;
        }

        if (genero) {
            const generoId = await AudiolibrosModel.getGeneroIdByName(genero);
            if (!genero) {
                return res.status(405).json({ 
                    error: "Género no existente"
                });
            }
            await AudiolibrosModel.setGenerosOfAudiolibro(audiolibro.id, generoId);
        }

        if (audios && audios.length > 0) {
            for (let i = 0; i < audios.length; i++) {
                const file = audios[i];
                const audioUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                    file.originalname, file.buffer, file.fieldname, file.mimetype
                );
                await AudiolibrosModel.subirCapitulo(audiolibro.id, i+1, audioUrl);
            }
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

        await AudiolibrosModel.deleteGeneroAudiolibro(audiolibroId);
        await AudiolibrosModel.deleteAudiolibro(audiolibroId);

        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

exports.updateAudiolibro = async (req, res) => {
    const { audiolibroId, nombreAutor, genero, audiosUrls } = req.body;
    let { titulo, descripcion } = req.body;
    const { image, audios } = req.files;

    try {
        const audiolibro = await AudiolibrosModel.getAudiolibroById(audiolibroId);
        if (!audiolibro) {
            return res.status(409).json({ error: "Audiolibro doesn't exist" });
        }

        if (titulo || nombreAutor || descripcion || (image && image.length > 0)) {
            titulo = !titulo ? audiolibro.titulo : titulo;
            descripcion = !descripcion ? audiolibro.descripcion : descripcion;

            let autorId;
            if (nombreAutor) {
                const autorPeticion = await AutoresModel.getAutor(nombreAutor);
                if (!autorPeticion) {
                    return res.status(404).json({ 
                        error: "Autor no existente"
                    });
                }
                autorId = autorPeticion.id;
            } else {
                autorId = audiolibro.autor;
            }

            let imgUrl;
            if (image && image.length > 0) {
                if (audiolibro.img) {
                    const imgName = audiolibro.img.substring(audiolibro.img.lastIndexOf('/') + 1);
                    await AzureBlobStorage.deleteImgFromAzureBlobStorage(imgName)
                }
                imgUrl = await AzureBlobStorage.uploadFileToAzureBlobStorage(
                    image[0].originalname, image[0].buffer, image[0].fieldname, image[0].mimetype
                );
            } else {
                imgUrl = audiolibro.img;
            }

            await AudiolibrosModel.updateAudiolibro(audiolibroId, titulo, autorId, descripcion, imgUrl);
        }

        if (genero) {
            const genero_audiolibro = await AudiolibrosModel.getGenerosOfAudiolibro(audiolibroId);
            if (!genero_audiolibro) {
                return res.status(405).json({ 
                    error: "Género no existente"
                });
            }
            if (genero_audiolibro[0].nombre != genero) {
                await AudiolibrosModel.deleteGeneroAudiolibro(audiolibroId);
                const generoId = await AudiolibrosModel.getGeneroIdByName(genero);
                await AudiolibrosModel.setGenerosOfAudiolibro(audiolibroId, generoId);
            }
        }

        let capitulosActuales;
        if (audiosUrls || audios) {
            capitulosActuales = await AudiolibrosModel.getCapitulosOfAudiolibro(audiolibroId);
        }

        if (audiosUrls) {
            capitulosActuales.forEach(async (capitulo) => {
                if (!audiosUrls || !audiosUrls.includes(capitulo.audio)) {
                    await AudiolibrosModel.eliminarCapitulo(audiolibroId, capitulo.audio);
                    const audioName = capitulo.audio.substring(capitulo.audio.lastIndexOf('/') + 1);
                    await AzureBlobStorage.deleteAudioFromAzureBlobStorage(audioName);
                }
            })
        }

        if (audios && audios.length > 0) {
            let ultimoCapitulo;
            if (capitulosActuales.length > 0) {
                ultimoCapitulo = capitulosActuales[capitulosActuales.length - 1].numero;
            } else {
                ultimoCapitulo = 0;
            }

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
