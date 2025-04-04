import { ticketDao } from '../dao/ticket.dao.js'; // Importación corregida

export class TicketRepository {
    // Crea un nuevo ticket
    static async createTicket(data) {
        try {
            return await ticketDao.create(data); 
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    // Obtiene un ticket por ID
    static async getTicketById(ticketId) {
        try {
            return await ticketDao.getById(ticketId);
        } catch (error) {
            throw new Error(`Error al obtener ticket por ID: ${error.message}`);
        }
    }

    // Obtiene todos los tickets
    static async getAllTickets() {
        try {
            return await ticketDao.getAll();
        } catch (error) {
            throw new Error(`Error al obtener todos los tickets: ${error.message}`);
        }
    }

    // Eliminar un ticket
    static async deleteTicket(ticketId) {
        try {
            return await ticketDao.delete(ticketId);
        } catch (error) {
            throw new Error(`Error al eliminar ticket: ${error.message}`);
        }
    }
}
