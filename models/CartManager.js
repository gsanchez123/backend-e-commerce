const fs = require('fs/promises');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        return cart || null; // Retorna null si no se encuentra el carrito
    }

    async createCart() {
        const carts = await this.getCarts();
        const maxId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) : 0;
        const newCart = { id: maxId + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        // Suponiendo que tenemos un ProductManager que valida si el producto existe
        const productExists = await productManager.getProductById(productId); // no olvidar de tener esta referencia
        if (!productExists) return null; // Producto no válido

        const product = cart.products.find(p => p.product === productId);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;
