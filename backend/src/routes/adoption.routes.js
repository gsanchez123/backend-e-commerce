// routes/adoption.routes.js
import express from 'express';
import { getAllAdoptions, createAdoption, getAdoptionById, deleteAdoption } from '../controllers/adoption.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtener todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones obtenida exitosamente
 */
router.get('/', getAllAdoptions);

/**
 * @swagger
 * /api/adoptions:
 *   post:
 *     summary: Crear una nueva adopción
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petName
 *               - adopterName
 *             properties:
 *               petName:
 *                 type: string
 *               adopterName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Adopción creada exitosamente
 */
router.post('/', createAdoption);

/**
 * @swagger
 * /api/adoptions/{id}:
 *   get:
 *     summary: Obtener una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción encontrada
 *       404:
 *         description: No se encontró la adopción
 */
router.get('/:id', getAdoptionById);

/**
 * @swagger
 * /api/adoptions/{id}:
 *   delete:
 *     summary: Eliminar una adopción
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción eliminada
 */
router.delete('/:id', deleteAdoption);

export default router;
