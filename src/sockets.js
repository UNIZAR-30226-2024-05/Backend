const sessions = require('client-sessions');
const io = require('./server'); // Importa el 'io' ya existente

const users = {};

io.on('connection', (socket) => {
    try {
        const sessionCookie = socket.handshake.headers.cookie.substring('session='.length);

        const sessionData = sessions.util.decode({
                cookieName: 'session',
                secret: 'secret'
            }, sessionCookie);

        const user_id = sessionData.content.user.user_id;
        console.log('Usuario autenticado:', user_id);

        if (!users[user_id]) {
            users[user_id] = [];
        }
        users[user_id].push(socket);
    } catch(error) {
        socket.emit('error', 'No session');
        socket.disconnect();
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
}

module.exports = {
    sendMessageToUser
};
