const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const path = require('path');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const viewRoutes = require('./routes/views.routes');
const { initializeSocket } = require('../services/SocketManager');

const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware de registro de solicitudes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('404', { message: 'Ruta no encontrada' });
});

// Inicialización del servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Inicializar WebSockets
initializeSocket(server);
