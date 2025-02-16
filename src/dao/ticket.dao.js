import Ticket from '../models/ticket.model.js';

class TicketDAO {
    // Crear un nuevo ticket
    async create(ticketData) {
        try {
            return await Ticket.create(ticketData);
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    // Obtener un ticket por ID con los productos poblados
    async getById(ticketId) {
        try {
            return await Ticket.findById(ticketId).populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al obtener ticket por ID: ${error.message}`);
        }
    }

    // Obtener todos los tickets
    async getAll() {
        try {
            return await Ticket.find().populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al obtener los tickets: ${error.message}`);
        }
    }

    // Actualizar un ticket por ID
    async update(ticketId, updateData) {
        try {
            return await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true }).populate('products.productId').exec();
        } catch (error) {
            throw new Error(`Error al actualizar el ticket: ${error.message}`);
        }
    }

    // Eliminar un ticket por ID
    async delete(ticketId) {
        try {
            return await Ticket.findByIdAndDelete(ticketId);
        } catch (error) {
            throw new Error(`Error al eliminar el ticket: ${error.message}`);
        }
    }
}

export const ticketDao = new TicketDAO();
