const express = require('express');
const ProductManager = require('../services/ProductManager');
const router = express.Router();

const productManager = new ProductManager('../data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const products = await productManager.getProducts(limit);
    res.json(products);
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

module.exports = router;
