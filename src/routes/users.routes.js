import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
} from '../controllers/users.controller.js';

import { authenticateUser } from '../dao/middlewares/auth.middleware.js';

const router = express.Router();

//  Registro de usuario
router.post('/register', registerUser);

//  Login de usuario
router.post('/login', loginUser);

//  Obtener perfil de usuario autenticado
router.get('/profile', authenticateUser, getUserProfile);

//  Cerrar sesión
router.post('/logout', authenticateUser, logoutUser);

export default router;
