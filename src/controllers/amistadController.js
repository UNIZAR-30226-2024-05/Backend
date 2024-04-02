const AmistadModel = require("../models/amistadModel");

exports.sendPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const hayAmistad = await AmistadModel.hayAmistad(user_id, other_id);
        if (hayAmistad) {
            return res.status(409).json({ 
                error: "Already friends"
            });
        }

        const pendienteEnviada = await AmistadModel.hayPeticionPendienteEnviada(user_id, other_id);
        if (pendienteEnviada) {
            return res.status(409).json({ 
                error: "Already sent request"
            });
        }

        const pendienteRecibida = await AmistadModel.hayPeticionPendienteRecibida(user_id, other_id);
        if (pendienteRecibida) {
            return res.status(409).json({ 
                error: "Already received request"
            });
        }

        await AmistadModel.addPeticion(user_id, other_id);

        // Notificar a other_id de petición enviada

        res.status(200).json({ 
            message: "Request sent"
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.acceptPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const pendienteRecibida = await AmistadModel.hayPeticionPendienteRecibida(user_id, other_id);
        if (!pendienteRecibida) {
            return res.status(409).json({ 
                error: "No received request"
            });
        }

        await AmistadModel.addAmistad(user_id, other_id);
        res.status(200).json({ 
            message: "Accepted request"
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.acceptPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const pendienteRecibida = await AmistadModel.hayPeticionPendienteRecibida(user_id, other_id);
        if (!pendienteRecibida) {
            return res.status(409).json({ 
                error: "No received request"
            });
        }

        await AmistadModel.acceptPeticion(user_id, other_id);
        await AmistadModel.addAmistad(user_id, other_id);

        // Notificar a other_id de que la petición fue aceptada

        res.status(200).json({ 
            message: "Accepted request"
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.rejectPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const pendienteRecibida = await AmistadModel.hayPeticionPendienteRecibida(user_id, other_id);
        if (!pendienteRecibida) {
            return res.status(409).json({ 
                error: "No received request"
            });
        }

        await AmistadModel.rejectPeticion(user_id, other_id);

        // Notificar a other_id de que la petición fue rechazada

        res.status(200).json({ 
            message: "Rejected request"
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.cancelPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const pendienteEnviada = await AmistadModel.hayPeticionPendienteEnviada(user_id, other_id);
        if (!pendienteEnviada) {
            return res.status(409).json({ 
                error: "No sent request"
            });
        }

        await AmistadModel.cancelPeticion(user_id, other_id);

        // Notificar a other_id de que la petición fue cancelada

        res.status(200).json({ 
            message: "Canceled request"
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeAmistad = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    try {
        const hayAmistad = await AmistadModel.hayAmistad(user_id, other_id);
        if (!hayAmistad) {
            return res.status(409).json({ 
                error: "Doesn't exist friendship"
            });
        }

        await AmistadModel.removeAmistad(user_id, other_id);
        res.status(200).json({ 
            message: "Friendship removed"
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};