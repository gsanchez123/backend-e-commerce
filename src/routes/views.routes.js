import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ProductManager from "../services/ProductManager.js";

const router = express.Router();

// Obtiene __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instancia de ProductManager con la ruta del JSON
const productManager = new ProductManager(path.join(__dirname, "../../data/products.json"));

//  Página principal - Home
router.get("/home", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});

//  Página de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realtimeproducts", { products });
    } catch (error) {
        console.error("Error en productos en tiempo real:", error);
        res.status(500).send("Error al obtener productos en tiempo real");
    }
});

export default router;
