import { TicketRepository } from '../repositories/ticket.repository.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
    static async createTicket({ amount, purchaser, products }) {
        try {
            if (!amount || !purchaser || !products || products.length === 0) {
                throw new Error('Datos de ticket inválidos');
            }

            const code = uuidv4().replace(/-/g, '').slice(0, 10); // Código más compacto y único

            return await TicketRepository.createTicket({
                code,
                amount,
                purchaser,
                products
            });
        } catch (error) {
            console.error(`Error al crear ticket: ${error.message}`);
            throw new Error('No se pudo generar el ticket.');
        }
    }

    static async getTicketById(ticketId) {
        try {
            const ticket = await TicketRepository.getTicketById(ticketId);
            if (!ticket) throw new Error('Ticket no encontrado');
            return ticket;
        } catch (error) {
            console.error(`Error al obtener ticket: ${error.message}`);
            throw new Error('No se pudo obtener el ticket.');
        }
    }
}
