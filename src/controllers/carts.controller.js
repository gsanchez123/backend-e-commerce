import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketService } from '../services/ticket.service.js';
import { MailingService } from '../services/mailing.service.js';

// 📌 Obtiene un carrito por ID
export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartRepository.getCartById(cid);

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

        const cart = await CartRepository.getCartById(cid);
        const product = await ProductRepository.getProductById(pid);

        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        if (product.stock < quantity) {
            return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });
        }

        await CartRepository.addProductToCart(cid, pid, quantity);
        await ProductRepository.updateProductStock(pid, -quantity);

        res.json({ status: 'success', message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(`Error al agregar producto al carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Elimina un producto específico del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await CartRepository.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        // Devolver stock del producto eliminado
        await ProductRepository.updateProductStock(pid, productInCart.quantity);

        // Remover el producto del carrito
        await CartRepository.deleteProductFromCart(cid, pid);

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error(`Error al eliminar producto del carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Vaciar el carrito completamente
export const emptyCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartRepository.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Devuelve stock de los productos al vaciar el carrito
        for (const item of cart.products) {
            await ProductRepository.updateProductStock(item.product, item.quantity);
        }

        // Vacia el carrito
        await CartRepository.updateCart(cid, { products: [] });

        res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (error) {
        console.error(`Error al vaciar carrito: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Proceso de compra y generación de ticket con envío de correo
export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { email } = req.user;

        const cart = await CartRepository.getCartById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        let totalAmount = 0;
        const purchasedProducts = [];
        const insufficientStock = [];

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product);
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                purchasedProducts.push({ product: product._id, quantity: item.quantity });
            } else {
                insufficientStock.push(product._id.toString());
            }
        }

        for (const item of purchasedProducts) {
            await ProductRepository.updateProductStock(item.product, -item.quantity);
        }

        let newTicket = null;
        if (purchasedProducts.length > 0) {
            newTicket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: email,
                products: purchasedProducts
            });

            await MailingService.sendMail({
                to: email,
                subject: "Confirmación de Compra",
                html: `<h1>¡Gracias por tu compra!</h1>
                        <p>Tu compra ha sido confirmada con el código: <strong>${newTicket.code}</strong></p>
                        <p>Total: <strong>$${newTicket.amount}</strong></p>`
            });
        }

        cart.products = cart.products.filter(item => insufficientStock.includes(item.product._id.toString()));
        await CartRepository.updateCart(cid, { products: cart.products });

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
