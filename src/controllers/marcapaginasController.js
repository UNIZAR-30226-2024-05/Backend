const marcapaginasModel = require("../models/marcapaginasModel");

exports.crearMarcapaginas = async (req, res) => {
    const { titulo, capitulo, tiempo } = req.body;
    const { user_id } = req.session.user;
    try {
        const newMarcapaginas = await marcapaginasModel.CrearMarcapaginas(user_id, titulo,capitulo, tiempo);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.BorrarMarcapaginas = async (req, res) => {
    const { marcapaginasID } = req.body;
    const { user_id } = req.session.user;
    try {
        const existingMarcapaginas = await marcapaginasModel.getMarcapaginasByID(marcapaginasID);
        const pertenece = await marcapaginasModel.getMarcapaginasByID_User(marcapaginasID,user_id);
        if (!existingMarcapaginas) {
            return res.status(404).json({ 
                error: "Not found" 
            });
        } else if (!pertenece) {
            return res.status(403).json({ 
                error: "No le pertenece el marcapaginas"
            });
        }
        const Borrado = await marcapaginasModel.BorrarMarcapaginas(marcapaginasID);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.ActualizarMarcapaginas = async (req, res) => {
    const { marcapaginasID, titulo, capitulo, tiempo } = req.body;
    const { user_id } = req.session.user;
    tituloprob = titulo;
    capituloprob = capitulo;
    tiempoprob = tiempo;
    try {
        const existingMarcapaginas = await marcapaginasModel.getMarcapaginasByID(marcapaginasID);
        const pertenece = await marcapaginasModel.getMarcapaginasByID_User(marcapaginasID,user_id);
        if (!existingMarcapaginas) {
            return res.status(404).json({ 
                error: "Not found" 
            });
        } else if (!pertenece) {
            return res.status(403).json({ 
                error: "No le pertenece el marcapaginas"
            });
        }
        if (titulo ==null|| titulo == ""){
            tituloprob = pertenece.titulo
        }

        if (capitulo ==null|| capitulo == ""){
            capituloprob = pertenece.capitulo
        }
        if (tiempo ==null|| tiempo == ""){
            tiempoprob = pertenece.fecha
        }
        const Borrado = await marcapaginasModel.ActualizarMarcapaginas(marcapaginasID,tituloprob,tiempoprob, capituloprob);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.ActualizarUltimoAudiolibro = async (req, res) => {
    const {capitulo, tiempo } = req.body;
    const { username, user_id } = req.session.user;
    try {
        // 4 casos. No existia previo ultimo||Datos actualizados del ultimo audiolibro || Datos actualizados de un libro previamente empezado(tipo 1) || Datos nuevo audiolibro
        ultimo = await marcapaginasModel.getUltimoAudiolibro(username);
        if(!ultimo){ //Caso no existia ningun marcapaginas tipo 0
             await marcapaginasModel.CrearUltimoAudiolibro(user_id, "",capitulo, tiempo);
        }else{ 
              const comparar = await marcapaginasModel.AudiolibroDelCapitulo(capitulo); 
             if(ultimo.audiolibro == comparar.audiolibro){ // Caso son datos del mismo audiolibro asi que solo hay que actualizarlos
                await marcapaginasModel.ActualizarMarcapaginas(ultimo.id, "", tiempo,capitulo);
             }else{  //caso no era del mismo audiolibro(comprueba si hay que borrar algun 1)
            await marcapaginasModel.CambiarUltimoMarcapaginas(ultimo.id);
            PreviamenteEmpezado = await marcapaginasModel.ExistiaAudiolibroEmpezadoByAudiolibro(comparar.audiolibro, user_id); 
                  if(PreviamenteEmpezado){ //Existia previamente como ya empezado
                  await marcapaginasModel.BorrarMarcapaginas(PreviamenteEmpezado.id);
                  }
                   await marcapaginasModel.CrearUltimoAudiolibro(user_id, "",capitulo, tiempo);
            }
    }
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};