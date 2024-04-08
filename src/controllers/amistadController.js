const AmistadModel = require("../models/amistadModel");
const { sendMessageToUser } = require('../sockets.js');

exports.sendPeticion = async (req, res) => {
    const { other_id } = req.body;
    const { user_id } = req.session.user;

    if (user_id == other_id) {
        return res.status(409).json({ 
            error: "Can't send itself"
        });
    }

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

        const peticion = await AmistadModel.addPeticion(user_id, other_id);

        // Notificar a other_id de petición enviada
        sendMessageToUser(other_id, 'peticionReceived', peticion);

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

        const peticion = await AmistadModel.acceptPeticion(user_id, other_id);
        await AmistadModel.addAmistad(user_id, other_id);

        // Notificar a other_id de que la petición fue aceptada
        sendMessageToUser(other_id, 'peticionAccepted', peticion);

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

        const peticion = await AmistadModel.rejectPeticion(user_id, other_id);

        // Notificar a other_id de que la petición fue rechazada
        sendMessageToUser(other_id, 'peticionRejected', peticion);

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

exports.getPeticiones = async (req, res) => {
    const { user_id } = req.session.user;

    try {
        const enviadas = await AmistadModel.getPeticionesEnviadas(user_id);
        const recibidas = await AmistadModel.getPeticionesRecibidas(user_id);
        const aceptadas = await AmistadModel.getPeticionesAceptadas(user_id);
        const rechazadas = await AmistadModel.getPeticionesRechazadas(user_id);

        res.status(200).json({ 
            enviadas: enviadas,
            recibidas: recibidas,
            aceptadas: aceptadas,
            rechazadas: rechazadas
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getAmigos = async (req, res) => {
    const { user_id } = req.session.user;

    try {
        const amigos = await AmistadModel.getAmigos(user_id);

        res.status(200).json({ 
            amigos: amigos
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};