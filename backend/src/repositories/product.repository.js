import { ProductDAO } from '../dao/product.dao.js';

export class ProductRepository {
    // Crea un nuevo producto
    static async createProduct(data) {
        try {
            return await ProductDAO.create(data);
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    // Obtiene un producto por ID
    static async getProductById(id) {
        try {
            return await ProductDAO.getById(id);
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }

    // Obtener todos los productos
    static async getAllProducts() {
        try {
            return await ProductDAO.getAll();
        } catch (error) {
            throw new Error(`Error al obtener todos los productos: ${error.message}`);
        }
    }

    // Actualizar un producto por ID
    static async updateProduct(id, data) {
        try {
            return await ProductDAO.update(id, data);
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    // Elimina un producto por ID
    static async deleteProduct(id) {
        try {
            return await ProductDAO.delete(id);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}
