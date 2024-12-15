const express = require('express');
const path = require('path');
const router = express.Router();

// Corrigiendo la ruta para 'ProductManager'
const ProductManager = require('../services/ProductManager');

// Usamos path.join para obtener la ruta absoluta del archivo JSON
const productManager = new ProductManager(path.join(__dirname, '../../data/products.json'));

// Página principal
router.get('/home', async (req, res) => {
    try {
        // Obtener productos desde ProductManager
        const products = await productManager.getProducts();
        // Renderizamos la vista 'home' pasando los productos como contexto
        res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

// Página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtener productos en tiempo real
        const products = await productManager.getProducts();
        // Renderizamos la vista 'realtimeproducts' pasando los productos
        res.render('realtimeproducts', { products });
    } catch (error) {
        console.error('Error fetching real-time products:', error);
        res.status(500).send('Error fetching real-time products');
    }
});

module.exports = router;
