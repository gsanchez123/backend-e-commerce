import Cart from '../models/cart.model.js';
import Product from './models/product.model.js';

// Obtiene carrito por ID
export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Agrega producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart || !product) {
            return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
        }

        const existingProduct = cart.products.find((prod) => prod.productId.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Elimina producto del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter((prod) => prod.productId.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Vaciar carrito
export const emptyCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
