import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para códigos únicos

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, default: () => `TCK-${uuidv4()}`, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }, // correo del usuario
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

