// src/daos/product.dao.js
import Product from '../models/products.model.js';

export class ProductDAO {
    // Crea un nuevo producto con validaciones
    static async create(productData) {
        try {
            const newProduct = new Product(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    // Obtiene producto por ID con control de errores
    static async getById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new Error(`Error al buscar producto por ID: ${error.message}`);
        }
    }

    // Obtiene todos los productos
    static async getAll() {
        try {
            return await Product.find({});
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Filtra productos por categoría
    static async getByCategory(category) {
        try {
            return await Product.find({ category });
        } catch (error) {
            throw new Error(`Error al buscar productos por categoría: ${error.message}`);
        }
    }

    // Actualiza un producto y devuelve la versión nueva
    static async update(id, data) {
        try {
            return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    // Elimina producto por ID con control de errores
    static async delete(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}
