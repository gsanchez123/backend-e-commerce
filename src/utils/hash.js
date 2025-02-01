import bcrypt from "bcrypt";

// Hashear la contraseña
export const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Comparar contraseña ingresada con la almacenada
export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};
