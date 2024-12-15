const socketio = require('socket.io');

const initializeSocket = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        // Manejar productos en tiempo real
        socket.on('addProduct', async (product) => {
            await productManager.addProduct(product);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        });

        socket.on('deleteProduct', async (id) => {
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts();
            io.emit('updateProducts', products);
        });

        // Manejar chat en tiempo real
        socket.on('sendMessage', (message) => {
            io.emit('newMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};

module.exports = { initializeSocket };

