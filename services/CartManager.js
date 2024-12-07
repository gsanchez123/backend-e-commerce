const fs = require('fs').promises;

class CartManager {
    constructor(cartPath, productPath) {
        this.cartPath = cartPath;
        this.productPath = productPath;
    }

    async createCart() {
        const carts = JSON.parse(await fs.readFile(this.cartPath, 'utf-8'));
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.cartPath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = JSON.parse(await fs.readFile(this.cartPath, 'utf-8'));
        const products = JSON.parse(await fs.readFile(this.productPath, 'utf-8'));
        const cart = carts.find(c => c.id === cartId);
        const product = products.find(p => p.id === productId);

        if (cart && product) {
            cart.products.push(product);
            await fs.writeFile(this.cartPath, JSON.stringify(carts, null, 2));
            return cart;
        }
        return null;
    }
}

module.exports = CartManager;
