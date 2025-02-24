import { UserDAO } from '../dao/user.dao.js'; // Se corrigió la ruta de importación

export class UserRepository {
    // Crea un nuevo usuario
    static async createUser(data) {
        try {
            return await UserDAO.create(data);
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    // Obtiene usuario por ID
    static async getUserById(id) {
        try {
            return await UserDAO.getById(id);
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }

    // Obtiene usuario por Email
    static async getUserByEmail(email) {
        try {
            return await UserDAO.getByEmail(email);
        } catch (error) {
            throw new Error(`Error al obtener usuario por Email: ${error.message}`);
        }
    }

    // Actualizar usuario
    static async updateUser(id, data) {
        try {
            return await UserDAO.update(id, data);
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    // Obtiene todos los usuarios
    static async getAllUsers() {
        try {
            return await UserDAO.getAll();
        } catch (error) {
            throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
        }
    }

    // Eliminar usuario
    static async deleteUser(id) {
        try {
            return await UserDAO.delete(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}
