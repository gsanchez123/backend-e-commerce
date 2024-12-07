const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit = null) {
        const data = await fs.readFile(this.path, 'utf-8');
        const products = JSON.parse(data);
        return limit ? products.slice(0, limit) : products;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;
    }
}

module.exports = ProductManager;
