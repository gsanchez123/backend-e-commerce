const socketio = require('socket.io');
const ProductManager = require('./ProductManager'); // Importar el gestor de productos
const productManager = new ProductManager('productos.json'); // Ruta del archivo de productos

const initializeSocket = (server) => {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log('🟢 Nuevo cliente conectado');

        // Enviar productos actuales al nuevo cliente
        socket.emit('updateProducts', async () => {
            const products = await productManager.getProducts();
            return products;
        });

        // Manejar la adición de un nuevo producto
        socket.on('addProduct', async (product) => {
            try {
                const newProduct = await productManager.addProduct(product);
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
                console.log(`✅ Producto agregado: ${newProduct.name}`);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Manejar la eliminación de un producto
        socket.on('deleteProduct', async (id) => {
            try {
                await productManager.deleteProduct(id);
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
                console.log(`🗑 Producto con ID ${id} eliminado`);
            } catch (error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Manejar chat en tiempo real
        socket.on('sendMessage', (message) => {
            io.emit('newMessage', message);
            console.log(`📩 Nuevo mensaje en el chat: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('🔴 Cliente desconectado');
        });
    });
};

module.exports = { initializeSocket };
