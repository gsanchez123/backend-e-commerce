import express from "express";
import { validateSchema } from "../dao/middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import passport from "passport";
import { UserDTO } from "../dtos/user.dto.js";
import jwt from "jsonwebtoken";
import { roleMiddleware } from "../dao/middlewares/role.middleware.js"; 

const router = express.Router();

/**
 * 🟢 REGISTRO DE USUARIO
 */
router.post("/register", validateSchema(registerSchema), async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Verifica si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ status: "error", message: "El usuario ya existe" });

        // Hashear la contraseña
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

        // Genera token JWT
        const token = generateToken(newUser);

        // Envia cookie con el token
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hora
        }).status(201).json({ status: "success", message: "Usuario registrado correctamente", token });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

/**
 * 🔵 LOGIN DE USUARIO
 */
router.post("/login", validateSchema(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca usuario
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ status: "error", message: "Usuario no encontrado" });

        // Validar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ status: "error", message: "Contraseña incorrecta" });

        // Generar token JWT
        const token = generateToken(user);

        // Envia cookie con el token
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hora
        }).json({ status: "success", message: "Login exitoso", token });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

/**
 * 🟠 OBTIENE USUARIO AUTENTICADO (Evitar enviar datos sensibles como cuando subiste .env)
 */
router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "No autorizado" });
        }
        const userDTO = new UserDTO(req.user);
        res.json({ status: "success", user: userDTO });
    } catch (error) {
        console.error("Error en /current:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

/**
 * 🔴 LOGOUT DEL USUARIO
 */
router.post("/logout", (req, res) => {
    res.clearCookie("jwt", { sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    res.json({ status: "success", message: "Sesión cerrada correctamente" });
});

/**
 *  VERIFICAR TOKEN VÁLIDO
 */
router.get("/verify-token", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ status: "error", message: "No autorizado" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ status: "success", user: decoded });
    } catch (error) {
        console.error("Error en verificación de token:", error);
        res.status(401).json({ status: "error", message: "Token inválido o expirado" });
    }
});

/**
 * ⚡ ADMINISTRADOR: Obtener lista de usuarios (Solo admin)
 */
router.get("/users", passport.authenticate("jwt", { session: false }), roleMiddleware("admin"), async (req, res) => { 
    try {
        const users = await User.find({}, "-password"); 
        res.json({ status: "success", users });
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

/**
 * ⚡ ADMINISTRADOR: Eliminar usuario (Solo admin)
 */
router.delete("/users/:id", passport.authenticate("jwt", { session: false }), roleMiddleware("admin"), async (req, res) => { 
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        res.json({ status: "success", message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ status: "error", message: "Error en el servidor" });
    }
});

export default router;
