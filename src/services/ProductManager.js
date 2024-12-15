const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, filePath);
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }
}

module.exports = ProductManager;
