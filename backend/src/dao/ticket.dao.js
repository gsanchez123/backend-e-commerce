import Ticket from '../models/ticket.model.js';

class TicketDAO {
    async create(ticketData) {
        try {
            return await Ticket.create(ticketData);
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async getById(ticketId) {
        try {
            return await Ticket.findById(ticketId).populate('products.product').exec();
        } catch (error) {
            throw new Error(`Error al obtener ticket por ID: ${error.message}`);
        }
    }

    async getAll() {
        try {
            return await Ticket.find().populate('products.product').exec();
        } catch (error) {
            throw new Error(`Error al obtener los tickets: ${error.message}`);
        }
    }

    async delete(ticketId) {
        try {
            return await Ticket.findByIdAndDelete(ticketId);
        } catch (error) {
            throw new Error(`Error al eliminar el ticket: ${error.message}`);
        }
    }
}

export const ticketDao = new TicketDAO();
