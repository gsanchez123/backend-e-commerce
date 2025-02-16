import { cartDao } from '../dao/cart.dao.js'; // Se corrigió la ruta de importación

export class CartRepository {
    // Crear un nuevo carrito
    static async createCart(data) {
        try {
            return await cartDao.create(data);
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    // Obtener un carrito por ID
    static async getCartById(cartId) {
        try {
            return await cartDao.getById(cartId);
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID: ${error.message}`);
        }
    }

    // Obtener todos los carritos
    static async getAllCarts() {
        try {
            return await cartDao.getAll();
        } catch (error) {
            throw new Error(`Error al obtener todos los carritos: ${error.message}`);
        }
    }

    // Actualizar un carrito
    static async updateCart(cartId, updateData) {
        try {
            return await cartDao.update(cartId, updateData);
        } catch (error) {
            throw new Error(`Error al actualizar carrito: ${error.message}`);
        }
    }

    // Eliminar un carrito
    static async deleteCart(cartId) {
        try {
            return await cartDao.delete(cartId);
        } catch (error) {
            throw new Error(`Error al eliminar carrito: ${error.message}`);
        }
    }

    // Eliminar un producto del carrito
    static async deleteProductFromCart(cartId, productId) {
        try {
            return await cartDao.deleteProductInCart(cartId, productId);
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }
}
