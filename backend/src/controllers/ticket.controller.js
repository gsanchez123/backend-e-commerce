import { TicketService } from '../services/ticket.service.js';
import { UserService } from '../services/user.service.js';

//  Crear un ticket de compra
export const createTicket = async (req, res) => {
    try {
        const { amount, purchaser, products } = req.body;

        // Validar datos de entrada
        if (!amount || !purchaser || !products || products.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios y deben contener productos' });
        }

        const user = await UserService.getUserByEmail(purchaser);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const newTicket = await TicketService.createTicket({ amount, purchaser, products });

        res.status(201).json({ status: 'success', payload: newTicket });
    } catch (error) {
        console.error(`Error al crear ticket: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

//  Obtener un ticket por ID
export const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await TicketService.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ status: 'error', message: 'Ticket no encontrado' });
        }

        res.json({ status: 'success', payload: ticket });
    } catch (error) {
        console.error(`Error al obtener ticket: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

//  Obtener todos los tickets de un usuario
export const getTicketsByUser = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await UserService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const tickets = await TicketService.getTicketsByPurchaser(email);

        res.json({ status: 'success', payload: tickets });
    } catch (error) {
        console.error(`Error al obtener tickets de usuario: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

//  Cancelar un ticket (Solo admins pueden hacerlo)
export const cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Verificar si el usuario tiene permisos para cancelar tickets
        if (req.user.role !== 'admin') {
            return res.status(403).json({ status: 'error', message: 'No tienes permisos para cancelar tickets' });
        }

        const canceledTicket = await TicketService.cancelTicket(ticketId);

        if (!canceledTicket) {
            return res.status(404).json({ status: 'error', message: 'Ticket no encontrado' });
        }

        res.json({ status: 'success', message: 'Ticket cancelado exitosamente' });
    } catch (error) {
        console.error(`Error al cancelar ticket: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
