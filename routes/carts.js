const express = require('express');
const CartManager = require('../services/CartManager');
const router = express.Router();

const cartManager = new CartManager('./data/carts.json', './data/products.json');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
});

// Agregar un producto al carrito
router.post('/:id/product/:productId', async (req, res) => {
    const cart = await cartManager.addProductToCart(parseInt(req.params.id), parseInt(req.params.productId));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }
});

module.exports = router;
