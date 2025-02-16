export const validateDto = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

            if (error) {
                const errorMessages = error.details.map(detail => detail.message);
                return res.status(400).json({ message: 'Error de validación', errors: errorMessages });
            }

            req.validatedData = value; // Guarda los datos validados en `req` por si se necesitan luego
            next();
        } catch (err) {
            console.error('Error en la validación DTO:', err.message);
            res.status(500).json({ message: 'Error interno en la validación de datos' });
        }
    };
};
