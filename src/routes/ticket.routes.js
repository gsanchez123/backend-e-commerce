import { Router } from 'express';
import { createTicket, getTicketById, getTicketsByUser, cancelTicket } from '../controllers/ticket.controller.js';
import { authenticateUser } from '../dao/middlewares/auth.middleware.js';
import { roleMiddleware } from '../dao/middlewares/role.middleware.js';

const router = Router();

//  Obtiene un ticket por ID (Debe estar autenticado)
router.get('/:tid', authenticateUser, getTicketById);

//  Obtiene todos los tickets de un usuario autenticado
router.get('/user/:email', authenticateUser, getTicketsByUser);

//  Crea un ticket (Se genera al finalizar una compra)
router.post('/', authenticateUser, createTicket);

//  Cancela un ticket (Solo admins pueden hacerlo)
router.delete('/:tid', authenticateUser, roleMiddleware('admin'), cancelTicket);

export default router;
