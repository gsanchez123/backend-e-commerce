const express = require('express');
const fs = require('fs').promises;
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware global
app.use(express.json()); // Manejo de JSON

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Cargar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

