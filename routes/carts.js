const express = require('express');
const CartManager = require('../models/CartManager');
const ProductManager = require('../models/ProductManager');

const router = express.Router();
const cartManager = new CartManager('./data/carts.json');
const productManager = new ProductManager('./data/products.json');

// Crear carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error creando carrito', error: error.message });
    }
});

// Obtener carrito
router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo carrito', error: error.message });
    }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const product = await productManager.getProductById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        if (!updatedCart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando carrito', error: error.message });
    }
});

module.exports = router;
