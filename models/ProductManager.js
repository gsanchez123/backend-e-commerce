const fs = require('fs/promises');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts(limit) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: products.length + 1, ...product, status: true };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updates, id };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (products.length === filteredProducts.length) return false;
        await fs.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        return true;
    }
}

module.exports = ProductManager;
