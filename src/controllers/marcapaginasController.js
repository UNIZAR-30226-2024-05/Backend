const marcapaginasModel = require("../models/marcapaginasModel");

exports.getUltimoAudiolibro = async (req, res) => {
    const { username } = req.params;
    try { 
        const audiolibro = await marcapaginasModel.getUltimoAudiolibro(username);
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