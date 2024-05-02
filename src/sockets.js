const sessions = require('client-sessions');
const io = require('./server'); // Importa el 'io' ya existente
const ClubModel = require("./models/clubModel");

const users = {};

io.on('connection', async (socket) => {
    try {
        const sessionCookie = socket.handshake.headers.cookie.substring('session='.length);

        const sessionData = sessions.util.decode({
                cookieName: 'session',
                secret: 'secret'
            }, sessionCookie);

        const user_id = sessionData.content.user.user_id;
        console.log('Usuario autenticado:', user_id);

        // Guardar socket en la lista
        if (!users[user_id]) {
            users[user_id] = [];
        }
        users[user_id].push(socket);

    } catch(error) {
        socket.emit('error', 'No session');
        socket.disconnect();
    }

    try {
        // Añadir socket a rooms de clubes de lectura
        const clubes = await ClubModel.getClubesOfUser(user_id);
        for (let i = 0; i < clubes.length; i++) {
            socket.join(`club_${clubes[i].id}`);
        }
        console.log(clubes);

        // Recepción mensajes
        socket.on("message", async (msg) => {
            // Obtener user_id del socket
            const user_id = obtenerUserIdOfSocket(socket);
            console.log(`Mensaje recibido por ${user_id}: `, msg);
            if (user_id != null) {
                // Comprobar que chat existe y es miembro
                if (await ClubModel.verificarMembresia(user_id, club_id)) {
                    // Guardar mensaje en bd
                    const mensaje = await ClubModel.addMessage(user_id, msg.club_id, msg.message);
                    // Emitir mensaje a miembros
                    sendMessageToRoom(`club_${msg.club_id}`, "message", msg);
                } else {
                    socket.emit('error', 'Not member of club');
                }
            } else {
                socket.emit('error', 'Unknown connection');
                socket.disconnect();
            }
        });

    } catch(error) {
        console.error(error.message);
        socket.emit('error', 'Server error');
    }

    socket.on('disconnect', () => {
        for (const user_id in users) {
            const index = users[user_id].indexOf(socket);
            if (index !== -1) {
                users[user_id].splice(index, 1);
                console.log('Socket desconectado para el usuario:', user_id);
                if (users[user_id].length === 0) {
                    delete users[user_id];
                    console.log('Usuario desconectado:', user_id);
                }
                break;
            }
        }
    });
});

// Devuelve el user_id vinculado a un socket
function obtenerUserIdOfSocket(socket) {
    for (user_id in users) {
        for (let i = 0; i < users[user_id].length; i++) {
            if (users[user_id][i] == socket) {
                return user_id;
            }
        }
    }
    return null;
}

// Función para enviar un mensaje a un usuario específico
function sendMessageToUser(user_id, evento, message) {
    const userSockets = users[user_id];
    if (userSockets) {
        userSockets.forEach(socket => {
            socket.emit(evento, message);
        });
    } else {
        console.log('El usuario no tiene sockets conectados');
    }
};

// Función para enviar un mensaje a una room
function sendMessageToRoom(room, evento, message) {
    io.to(room).emit(evento, message);
};

// Función para añadir socket a una room
function addSocketsToRoom(user_id, room) {
    const sockets = users[user_id];
    if (sockets != null) {
        if (io.sockets.adapter.rooms.has(room)) {
            for (let i = 0; i < sockets.length; i++) {
                sockets[i].join(room);
            }
        }
    }
};

// Función para quitar socket de una room
function removeSocketsFromRoom(user_id, room) {
    const sockets = users[user_id];
    if (sockets != null) {
        if (io.sockets.adapter.rooms.has(room)) {
            for (let i = 0; i < sockets.length; i++) {
                sockets[i].leave(room);
            }
        }
    }
};

function deleteRoom(room) {
    if (io.sockets.adapter.rooms.has(room)) {
        io.sockets.adapter.del(room);
    }
};

module.exports = {
    sendMessageToUser, sendMessageToRoom, addSocketsToRoom, removeSocketsFromRoom, deleteRoom
};
