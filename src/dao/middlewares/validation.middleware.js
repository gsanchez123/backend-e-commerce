import { ZodError } from "zod";

export const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }));
                return res.status(400).json({ message: "Error de validación", errors: formattedErrors });
            }
            res.status(500).json({ message: "Error interno en la validación de datos" });
        }
    };
};
