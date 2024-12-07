const { Server } = require('socket.io');

function initializeSocket(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return io;
}

module.exports = { initializeSocket };

