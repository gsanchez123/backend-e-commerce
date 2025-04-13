import Cart from '../models/cart.model.js';

class CartDao {
    async getAll() {
        return await Cart.find().populate('products.product');
    }

    async getById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async create(data) {
        return await Cart.create(data);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async update(id, data) {
        return await Cart.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }
}

export const cartDao = new CartDao();
