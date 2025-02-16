import express from "express";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import passport from "passport";
import { UserDTO } from "../dtos/user.dto.js";

const router = express.Router();

// 🟢 Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role = "user" } = req.body;

        // Verifica si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ status: "success", message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

// 🔵 Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Validar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

        // Generar token JWT
        const token = generateToken(user);

        // Enviar token como cookie segura
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000 // 1 hora
        }).json({ status: "success", message: "Login exitoso", token });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

// 🟠 Obtener usuario autenticado con DTO
router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const userDTO = new UserDTO(req.user);
        res.json({ status: "success", user: userDTO });
    } catch (error) {
        console.error("Error en /current:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

// 🔴 Logout del usuario
router.post("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.json({ status: "success", message: "Sesión cerrada correctamente" });
});

export default router;
