import { z } from "zod";

// 🟢 Esquema para el registro de usuario
export const registerSchema = z.object({
    first_name: z.string().min(2, "El nombre es obligatorio y debe tener al menos 2 caracteres."),
    last_name: z.string().min(2, "El apellido es obligatorio y debe tener al menos 2 caracteres."),
    email: z.string().email("El correo no es válido."),
    age: z.number().min(18, "Debes ser mayor de edad."),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    role: z.enum(["user", "admin"]).optional().default("user") // 🔹 Define los roles permitidos
});

// 🔵 Esquema para el login de usuario
export const loginSchema = z.object({
    email: z.string().email("El correo no es válido."),
    password: z.string().min(6, "La contraseña es obligatoria."),
});

// 🟠 Esquema para actualizar perfil de usuario
export const updateUserSchema = z.object({
    first_name: z.string().min(2).optional(),
    last_name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    age: z.number().min(18).optional(),
    role: z.enum(["user", "admin"]).optional(),
});
