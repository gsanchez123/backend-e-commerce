const express = require('express');
const ProductManager = require('../models/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo productos', error: error.message });
    }
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo producto', error: error.message });
    }
});

// Crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        if (!productData.name || !productData.price || !productData.category) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        const newProduct = await productManager.addProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creando producto', error: error.message });
    }
});

// Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updates = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updates);
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando producto', error: error.message });
    }
});

// Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const success = await productManager.deleteProduct(productId);
        if (!success) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando producto', error: error.message });
    }
});

module.exports = router;

