const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, filePath);
    }

    // Obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    // Agregar un nuevo producto
    async addProduct(product) {
        try {
            const products = await this.getProducts();

            // Validación para evitar productos duplicados
            if (products.some(p => p.name === product.name)) {
                throw new Error(`El producto "${product.name}" ya existe.`);
            }

            product.id = products.length ? products[products.length - 1].id + 1 : 1;
            products.push(product);

            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            throw new Error(`Error al obtener el producto con ID ${id}: ${error.message}`);
        }
    }

    // Actualizar un producto por ID
    async updateProduct(id, updatedData) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);

            if (index === -1) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            products[index] = { ...products[index], ...updatedData };
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

            return products[index];
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            const filteredProducts = products.filter(p => p.id !== id);

            if (products.length === filteredProducts.length) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            await fs.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
            return { message: `Producto con ID ${id} eliminado correctamente.` };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

module.exports = ProductManager;
