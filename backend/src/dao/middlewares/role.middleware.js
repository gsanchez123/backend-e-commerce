export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Acceso denegado: usuario no autenticado' });
            }

            if (!req.user.role) {
                return res.status(403).json({ message: 'Acceso denegado: no se encontró un rol asociado' });
            }

            if (req.user.role !== requiredRole) {
                return res.status(403).json({ message: 'Acceso denegado: no tienes los permisos necesarios' });
            }

            next();
        } catch (error) {
            console.error('Error en la validación del rol:', error.message);
            res.status(500).json({ message: 'Error interno en la validación de roles' });
        }
    };
};

export default roleMiddleware; 

