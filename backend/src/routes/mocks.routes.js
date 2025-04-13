import { Router } from "express";
import { generateUsers, generatePets } from "../utils/mocking.js";
import UserModel from "../models/user.model.js";
import PetModel from "../models/pet.model.js";

const router = Router();

// Endpoint para obtener mascotas mockeadas con cantidad por query
router.get("/mockingpets", async (req, res) => {
    try {
        const quantity = parseInt(req.query.quantity) || 10; // Por defecto 10
        const pets = generatePets(quantity);
        res.json({ status: "success", pets });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Endpoint para obtener usuarios mockeados con cantidad por query
router.get("/mockingusers", async (req, res) => {
    try {
        const quantity = parseInt(req.query.quantity) || 50; // Por defecto 50
        const users = generateUsers(quantity);
        res.json({ status: "success", users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Endpoint para generar datos e insertarlos en la base de datos
router.post("/generateData", async (req, res) => {
    try {
        const { users, pets } = req.body;

        if (!users || !pets) {
            return res.status(400).json({ status: "error", message: "Faltan parámetros" });
        }

        const mockUsers = generateUsers(users);
        const mockPets = generatePets(pets);

        await UserModel.insertMany(mockUsers);
        await PetModel.insertMany(mockPets);

        res.json({ status: "success", message: "Datos generados e insertados correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;
