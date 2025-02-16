import Cart from '../models/cart.model.js';

class CartDao {
    // Obtener todos los carritos
    async getAll() {
        try {
            return await Cart.find().populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    // Obtener un carrito por ID con productos poblados
    async getById(id) {
        try {
            return await Cart.findById(id).populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID: ${error.message}`);
        }
    }

    // Crear un nuevo carrito
    async create(data) {
        try {
            return await Cart.create(data);
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    // Agregar un producto al carrito o aumentar su cantidad si ya existe
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    // Actualizar un carrito completo
    async update(id, data) {
        try {
            return await Cart.findByIdAndUpdate(id, data, { new: true }).populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al actualizar carrito: ${error.message}`);
        }
    }

    // Eliminar un carrito por ID
    async delete(id) {
        try {
            return await Cart.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar carrito: ${error.message}`);
        }
    }

    // Eliminar un producto específico dentro de un carrito
    async deleteProductInCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    // Vaciar un carrito completamente
    async emptyCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }
}

export const cartDao = new CartDao();
