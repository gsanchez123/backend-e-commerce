const fs = require('fs').promises;

class CartManager {
    constructor(cartPath, productPath) {
        this.cartPath = cartPath;
        this.productPath = productPath;
    }

    // Método para leer los carritos desde el archivo
    async _readCarts() {
        try {
            const data = await fs.readFile(this.cartPath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return []; // Retorna un array vacío si el archivo no existe
        }
    }

    // Método para escribir los carritos en el archivo
    async _writeCarts(carts) {
        try {
            await fs.writeFile(this.cartPath, JSON.stringify(carts, null, 2));
        } catch (error) {
            throw new Error('Error al guardar los carritos');
        }
    }

    // Método para leer los productos desde el archivo
    async _readProducts() {
        try {
            const data = await fs.readFile(this.productPath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return []; // Retorna un array vacío si el archivo no existe
        }
    }

    // Crea un nuevo carrito
    async createCart() {
        try {
            const carts = await this._readCarts();
            const newCart = { id: carts.length + 1, products: [] };
            carts.push(newCart);
            await this._writeCarts(carts);
            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    // Agrega un producto a un carrito
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this._readCarts();
            const products = await this._readProducts();

            const cartIndex = carts.findIndex(c => c.id === cartId);
            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const product = products.find(p => p.id === productId);
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }

            // Busca si el producto ya está en el carrito
            const existingProductIndex = carts[cartIndex].products.findIndex(p => p.id === productId);

            if (existingProductIndex !== -1) {
                // Si ya está en el carrito, aumentar la cantidad
                carts[cartIndex].products[existingProductIndex].quantity += 1;
            } else {
                // Si no está, agregarlo con cantidad 1
                carts[cartIndex].products.push({ ...product, quantity: 1 });
            }

            await this._writeCarts(carts);
            return carts[cartIndex];

        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

module.exports = CartManager;
