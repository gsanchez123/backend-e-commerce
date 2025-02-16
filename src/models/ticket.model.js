import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }, // correo del usuario que realiza la compra
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

// Asegurar exportación correcta para evitar errores
const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
