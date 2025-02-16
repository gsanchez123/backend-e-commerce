import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Acceso denegado, token no proporcionado o formato incorrecto' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en la autenticación:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado, inicia sesión nuevamente' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        }

        return res.status(500).json({ message: 'Error en la autenticación del usuario' });
    }
};

