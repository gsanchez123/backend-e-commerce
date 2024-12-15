const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./services/ProductManager'); // Asegúrate de que ProductManager esté en esta ubicación
const fs = require('fs');

// Inicialización de la aplicación
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  // Asegúrate de que las vistas estén en esta carpeta

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Asegúrate de que los archivos estáticos estén aquí

// Creación de ProductManager para manejar los productos
const productManager = new ProductManager('./data/products.json');

// Rutas
const viewRoutes = require('./routes/views.routes');  // Importar las rutas de vista
app.use('/', viewRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Conexión de WebSocket con Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar lista de productos al cliente que se conecta
    socket.emit('updateProducts', productManager.getProducts());

    // Escuchar cuando un producto es agregado
    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
        io.emit('updateProducts', await productManager.getProducts());
    });

    // Escuchar cuando un producto es eliminado
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        io.emit('updateProducts', await productManager.getProducts());
    });

    // Persistencia del chat: Escuchar mensajes enviados
    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Configuración del puerto
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
