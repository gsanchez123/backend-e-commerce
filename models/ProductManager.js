const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit = null) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            throw new Error('Error leyendo los productos');
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products.find(product => product.id === id);
        } catch (error) {
            throw new Error('Error leyendo el producto');
        }
    }

    async addProduct(productData) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            const newProduct = { ...productData, id: products.length + 1 };
            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            throw new Error('Error agregando el producto');
        }
    }
}

module.exports = ProductManager;
