import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketService } from './ticket.service.js';

export class CartService {
    static async purchaseCart(cartId, purchaserEmail) {
        try {
            // 1. Obtiene carrito
            const cart = await CartRepository.getCartById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            let totalAmount = 0;
            const purchasedProducts = [];
            const insufficientStock = [];

            const productUpdates = [];
            for (const item of cart.items) {
                const product = await ProductRepository.getProductById(item.product._id);
                if (!product) {
                    insufficientStock.push(item.product._id.toString());
                    continue;
                }

                if (product.stock >= item.quantity) {
                    totalAmount += product.price * item.quantity;
                    purchasedProducts.push({
                        product: product._id,
                        quantity: item.quantity
                    });

                    productUpdates.push({
                        productId: product._id,
                        newStock: product.stock - item.quantity
                    });
                } else {
                    insufficientStock.push(product._id.toString());
                }
            }

            for (const update of productUpdates) {
                await ProductRepository.updateProduct(update.productId, { stock: update.newStock });
            }

            let newTicket = null;
            if (purchasedProducts.length > 0) {
                newTicket = await TicketService.createTicket({
                    amount: totalAmount,
                    purchaser: purchaserEmail,
                    products: purchasedProducts
                });
            }

            const newItems = cart.items.filter(item => insufficientStock.includes(item.product._id.toString()));
            await CartRepository.updateCart(cartId, { items: newItems });

            return {
                ticket: newTicket,
                notProcessed: insufficientStock
            };
        } catch (error) {
            console.error(`Error en la compra del carrito: ${error.message}`);
            throw new Error('Error al procesar la compra.');
        }
    }
}
