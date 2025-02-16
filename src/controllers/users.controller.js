import User from '../models/User.model.js';
import { UserDTO } from '../dtos/user.dto.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcrypt';

// 📌 Registro de usuario con validaciones
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validar datos obligatorios
        if (!name || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario y hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, role });

        await user.save();

        res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(`Error en el registro: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

// 📌 Login de usuario con validaciones y token seguro
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar datos de entrada
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email y contraseña son requeridos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Contraseña incorrecta' });
        }

        const token = generateToken(user);

        // Enviar token como cookie segura
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // En producción, usar HTTPS
            maxAge: 3600000 // 1 hora
        });

        res.json({ status: 'success', message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(`Error en el login: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

// 📌 Obtener perfil del usuario autenticado con DTO
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        // Enviar solo la información necesaria con DTO
        const userDTO = new UserDTO(user);
        res.json({ status: 'success', payload: userDTO });
    } catch (error) {
        console.error(`Error al obtener perfil: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

// 📌 Logout de usuario
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.json({ status: 'success', message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error(`Error en el logout: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};
