import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            default: 1, 
            min: [1, 'La cantidad debe ser al menos 1'] 
        },
        priceAtPurchase: { 
            type: Number, 
            required: true 
        },
        size: { 
            type: String, 
            default: 'M' 
        },
        color: { 
            type: String, 
            default: 'Negro' 
        }
    }],
    total: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para actualiza `updatedAt` y recalcular el total antes de guardar
cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    this.total = this.products.reduce((acc, item) => acc + (item.quantity * item.priceAtPurchase), 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
