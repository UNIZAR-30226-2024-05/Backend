const clubesModel = require("../models/clubModel");

exports.CrearClub = async (req, res) => {
    const { nombre, audiolibroID, descripcion} = req.body;
    const { user_id } = req.session.user;
    try {
        const newClub = await clubesModel.CrearClub(nombre, audiolibroID,descripcion, user_id);
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
            return res.status(409).json({  //revisar si era el 409
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

