import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/users.controller.js';
import { authenticateUser } from '../dao/middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, getUserProfile);

export default router;
