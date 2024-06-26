const clubesModel = require("../models/clubModel");
const io = require('../services/sockets');

exports.CrearClub = async (req, res) => {
    const { nombre, audiolibroID, descripcion} = req.body;
    const { user_id } = req.session.user;
    try {
        const club = await clubesModel.CrearClub(nombre, audiolibroID,descripcion, user_id);
        console.log(club);
        await clubesModel.unirseAlClub(user_id, club.id);
        io.addSocketsToRoom(user_id, `club_${club.id}`);
        res.status(200).json({
            message: "OK",
            club
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
        }else if(existe.adminn != user_id){
            return res.status(401).json({  //revisar si era el 401
                error: "Not owner" 
            });
        }
        await clubesModel.BorrarClub(id);
        io.deleteRoom(`club_${id}`);
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
        io.addSocketsToRoom(user_id, `club_${id}`);
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
        if(existe.owner == user_id){
            return res.status(401).json({  //revisar si era el 401
                error: "Owner cannot leave" 
            });
        }
        await clubesModel.salirseDelClub(user_id,id);
        io.removeSocketsFromRoom(user_id, `club_${id}`)
        res.status(200).json({
            message: "OK"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getClubesOfUser = async (req, res) => {
    const { user_id } = req.session.user;
    try {
        const listaClubes = await clubesModel.getClubesOfUser(user_id);
        res.status(200).json({ 
            listaClubes
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

exports.getClubesNotOfUser = async (req, res) => {
    const { user_id } = req.session.user;
    try {
        const listaClubes = await clubesModel.getClubesNotOfUser(user_id);
        res.status(200).json({ 
            listaClubes
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

exports.DatosDelClub = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.session.user;
    try {
        club = await clubesModel.getClubByID(id);
        if (!club){
            return res.status(404).json({ 
                 error: "Not Existing club" 
             });
        }
        if(club.adminn == user_id){
            owner = true;
            membresia = true;
        }else{
            owner = false;
            membresia = !!await clubesModel.verificarMembresia(user_id, id);
        }
        members = await clubesModel.obtenerMiembrosClub(id);
        messages = await clubesModel.getMessagesOfClub(id);
        res.status(200).json({ 
            message: "OK",
            club: {
                id: club.id,
                nombre: club.nombre,
                descripcion: club.descripcion,
                isadmin: owner,
                ismember: membresia,
                audiolibro: {
                    id: club.id_audiolibro,
                    titulo: club.titulo,
                    img: club.img
                },
                members,
                messages
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
