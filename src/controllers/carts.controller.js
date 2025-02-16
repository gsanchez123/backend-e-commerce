import Cart from '../models/cart.model.js';
import Product from '../models/products.model.js';
import { TicketService } from '../services/ticket.service.js';

// 📌 Obtiene un carrito por ID
export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.productId');

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(`Error al obtener carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Agrega un producto al carrito con validación de stock
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser mayor a 0' });
        }

        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });
        }

        const existingProduct = cart.products.find((prod) => prod.productId.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity });
        }

        await cart.save();
        product.stock -= quantity;
        await product.save();

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(`Error al agregar producto al carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Elimina un producto específico del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex((prod) => prod.productId.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Recuperar la cantidad del producto eliminada y devolver al stock
        const product = await Product.findById(pid);
        if (product) {
            product.stock += cart.products[productIndex].quantity;
            await product.save();
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error(`Error al eliminar producto del carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Vaciar un carrito completamente
export const emptyCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Devolver stock de los productos al vaciar el carrito
        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (error) {
        console.error(`Error al vaciar carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Proceso de compra y generación de ticket
export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { email } = req.user; // Usuario autenticado

        const cart = await Cart.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const purchasedProducts = [];
        const insufficientStock = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                purchasedProducts.push({
                    product: product._id,
                    quantity: item.quantity
                });
            } else {
                insufficientStock.push(product._id.toString());
            }
        }

        // Actualizar stock para productos comprados
        for (const item of cart.products) {
            if (!insufficientStock.includes(item.productId.toString())) {
                const product = await Product.findById(item.productId);
                product.stock -= item.quantity;
                await product.save();
            }
        }

        // Generar ticket si hay productos comprados
        let newTicket = null;
        if (purchasedProducts.length > 0) {
            newTicket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: email,
                products: purchasedProducts
            });
        }

        // Filtrar productos que no se pudieron comprar
        const remainingItems = cart.products.filter(item => insufficientStock.includes(item.productId.toString()));
        cart.products = remainingItems;
        await cart.save();

        res.json({
            status: 'success',
            ticket: newTicket,
            notProcessed: insufficientStock
        });
    } catch (error) {
        console.error(`Error en el proceso de compra: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
