// services/SocketManager.js
const socketio = require('socket.io');

const initializeSocket = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};

module.exports = { initializeSocket };

