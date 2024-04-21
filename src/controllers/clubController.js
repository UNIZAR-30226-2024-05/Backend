const clubesModel = require("../models/clubModel");

exports.CrearClub = async (req, res) => {
    const { nombre, audiolibroID, descripcion} = req.body;
    const { user_id } = req.session.user;
    try {
        await clubesModel.CrearClub(nombre, audiolibroID,descripcion, user_id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.BorrarClub = async (req, res) => {
    const { id } = req.body;
    const { user_id } = req.session.user;
    try {
        existe = await clubesModel.getClubByID(id);
        if (!existe){
            return res.status(404).json({ 
                 error: "Not Existing club" 
             });
        }else if(existe.owner != user_id){
            return res.status(401).json({  //revisar si era el 401
                error: "Not owner" 
            });
        }
        await clubesModel.BorrarClub(id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.UniserAClub = async (req, res) => {
    const { id } = req.body;
    const { user_id } = req.session.user;
    try {
        existe = await clubesModel.getClubByID(id);
        if (!existe){
            return res.status(404).json({ 
                 error: "Not Existing club" 
             });
        }else{
            membresia = await clubesModel.verificarMembresia(user_id,id);
            if(membresia){
                return res.status(409).json({  //revisar si era el 409
                    error: "Already a member" 
                });
            }
        }
        await clubesModel.unirseAlClub(user_id,id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.SalirseDelClub = async (req, res) => {
    const { id } = req.body;
    const { user_id } = req.session.user;
    try {
        existe = await clubesModel.getClubByID(id);
        if (!existe){
            return res.status(404).json({ 
                 error: "Not Existing club" 
             });
        }else{
            membresia = await clubesModel.verificarMembresia(user_id,id);
            if(!membresia){
                return res.status(409).json({  //revisar si era el 409
                    error: "Not a member" 
                });
            }
        }
        await clubesModel.salirseDelClub(user_id,id);
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.DatosDelClub = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.session.user;
    try {
        console.log(id);
        club = await clubesModel.getClubByID(id);
        console.log(club);
        if (!club){
            return res.status(404).json({ 
                 error: "Not Existing club" 
             });
        }
        if(club.owner == user_id){
            owner = true;
            membresia = true;
        }else{
            owner = false;
            Vmembresia = await clubesModel.verificarMembresia(user_id,id);
            if(Vmembresia){
                membresia = true;
            }else{
                membresia = false;
            }
        }
        miembros = await clubesModel.obtenerMiembrosClub(id);
        res.status(200).json({ club,owner,membresia, miembros});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
