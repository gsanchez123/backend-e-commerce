export const checkId = (req, res, next) => {
    const { id } = req.params;

    // Verifica que el ID sea un número entero válido o un ObjectId de MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID inválido. Debe ser un ObjectId de MongoDB válido." });
    }

    next();
};
