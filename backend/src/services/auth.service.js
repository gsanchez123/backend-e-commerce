import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { generateToken } from '../utils/generateToken.js';

export class AuthService {
    static async registerUser({ name, email, password }) {
        try {
            if (!name || !email || !password) throw new Error('Todos los campos son obligatorios');

            const existingUser = await UserRepository.getUserByEmail(email);
            if (existingUser) throw new Error('El usuario ya está registrado');

            // Hashear la contraseña antes de guardarla
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            return await UserRepository.createUser({
                name,
                email,
                password: hashedPassword
            });
        } catch (error) {
            console.error(`Error al registrar usuario: ${error.message}`);
            throw new Error('No se pudo registrar el usuario.');
        }
    }

    static async loginUser({ email, password }) {
        try {
            if (!email || !password) throw new Error('Email y contraseña son obligatorios');

            const user = await UserRepository.getUserByEmail(email);
            if (!user) throw new Error('Usuario no encontrado');

            // Verificar contraseña con bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Contraseña incorrecta');

            const token = generateToken(user);
            return { user, token };
        } catch (error) {
            console.error(`Error al iniciar sesión: ${error.message}`);
            throw new Error('No se pudo iniciar sesión.');
        }
    }
}
