const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware global
app.use(express.json());
app.use(cors()); // Permitir solicitudes desde el frontend

// Middleware para servir archivos estáticos (como imágenes)
app.use('/public', express.static('public'));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta de prueba de conexión
app.get('/', (req, res) => {
    res.send('Bienvenido al backend de e-commerce!');
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error interno del servidor:', err.message);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});