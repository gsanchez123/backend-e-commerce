import express from "express";
import User from "../models/User.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const router = express.Router();

// 🟢 Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verifica si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        // Crea usuario con contraseña encriptada
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashPassword(password),
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// 🔵 Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuario por email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Validar contraseña
        if (!comparePassword(password, user.password))
            return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generar JWT y enviarlo como cookie
        const token = generateToken(user);
        res.cookie("jwt", token, { httpOnly: true }).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// 🟠 Ruta `/current` para obtener el usuario autenticado
router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
    res.json({ user: req.user });
});

export default router;
