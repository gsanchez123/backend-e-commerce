import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { generateToken } from '../utils/generateToken.js';
import { UserDTO } from '../dtos/user.dto.js';

export class UserService {
    // **Registrar usuario**
    static async registerUser({ first_name, last_name, email, age, password }) {
        try {
            // Verifica si el usuario ya existe
            const existingUser = await UserRepository.getUserByEmail(email);
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario
            const newUser = await UserRepository.createUser({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role: 'user'
            });

            return new UserDTO(newUser); // Retorna DTO sin datos sensibles
        } catch (error) {
            throw new Error(`Error en el registro: ${error.message}`);
        }
    }

    //  **Login de usuario**
    static async loginUser({ email, password }) {
        try {
            const user = await UserRepository.getUserByEmail(email);
            if (!user) throw new Error('Usuario no encontrado');

            // Comparar contraseña encriptada
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Contraseña incorrecta');

            // Generar Token JWT
            const token = generateToken(user);
            return { user: new UserDTO(user), token };
        } catch (error) {
            throw new Error(`Error en el login: ${error.message}`);
        }
    }

    //  **Obtener usuario por ID**
    static async getUserById(userId) {
        try {
            const user = await UserRepository.getUserById(userId);
            if (!user) throw new Error('Usuario no encontrado');
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    //  **Actualizar usuario**
    static async updateUser(userId, updateData) {
        try {
            // Si se intenta actualizar la contraseña, encriptarla antes de guardarla
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            const updatedUser = await UserRepository.updateUser(userId, updateData);
            if (!updatedUser) throw new Error('Usuario no encontrado o actualización fallida');
            
            return new UserDTO(updatedUser);
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    //  **Eliminar usuario**
    static async deleteUser(userId) {
        try {
            const deletedUser = await UserRepository.deleteUser(userId);
            if (!deletedUser) throw new Error('Usuario no encontrado o no eliminado');
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}
