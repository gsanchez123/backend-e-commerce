// src/daos/user.dao.js
import User from '../models/User.model.js';

export class UserDAO {
    // Crea un nuevo usuario con validaciones
    static async create(userData) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Obtiene usuario por ID con control de errores
    static async getById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error(`Error al buscar usuario por ID: ${error.message}`);
        }
    }

    // Obtiene usuario por email con validación
    static async getByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error al buscar usuario por email: ${error.message}`);
        }
    }

    // Actualiza usuario y retorna la versión nueva
    static async update(id, data) {
        try {
            return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Elimina usuario por ID con control de errores
    static async delete(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}
