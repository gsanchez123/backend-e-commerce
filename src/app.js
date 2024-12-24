import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import path from 'path';
import ProductManager from './services/ProductManager.js'; // Modificado para importar correctamente
import { connectMongoDB } from './config/mongodb.config.js';
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';

// Inicialización de la aplicación
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  // Ruta a las vistas

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Archivos estáticos

// Conexión a MongoDB
connectMongoDB();

// Rutas
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Conexión de WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Configuración del puerto
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
