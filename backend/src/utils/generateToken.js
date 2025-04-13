import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
    try {
        if (!user || !user._id || !user.email || !user.role) {
            throw new Error('Datos de usuario inválidos para generar el token.');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('Falta la clave secreta para firmar el token. Verifica el archivo .env');
        }

        return jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
                algorithm: 'HS256' // Algoritmo seguro de firma
            }
        );
    } catch (error) {
        console.error(`Error al generar el token: ${error.message}`);
        throw new Error('No se pudo generar el token.');
    }
};
