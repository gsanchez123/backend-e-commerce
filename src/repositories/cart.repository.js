import { cartDao } from '../dao/cart.dao.js';

export class CartRepository {
    static async createCart(data) {
        return await cartDao.create(data);
    }

    static async getCartById(cartId) {
        return await cartDao.getById(cartId);
    }

    static async getAllCarts() {
        return await cartDao.getAll();
    }

    static async updateCart(cartId, updateData) {
        return await cartDao.update(cartId, updateData);
    }

    static async deleteCart(cartId) {
        return await cartDao.delete(cartId);
    }

    static async addProductToCart(cartId, productId, quantity) {
        return await cartDao.addProductToCart(cartId, productId, quantity);
    }
}
