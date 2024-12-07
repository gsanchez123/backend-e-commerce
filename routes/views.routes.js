const express = require('express');
const router = express.Router();
const ProductManager = require('../services/ProductManager');

const productManager = new ProductManager('./data/products.json');

// Página principal
router.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

// Página de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', { products });
});

module.exports = router;
