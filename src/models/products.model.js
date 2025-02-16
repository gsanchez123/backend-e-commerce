import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre del producto es obligatorio'], 
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'], 
        min: [0, 'El precio no puede ser negativo'] 
    },
    description: { 
        type: String, 
        trim: true 
    },
    category: { 
        type: String, 
        required: [true, 'La categoría es obligatoria'], 
        enum: ['remeras', 'zapatillas', 'trajes de baño', 'musculosas', 'pantalones', 'gorras', 'otros'],
        default: 'otros'
    },
    stock: { 
        type: Number, 
        default: 0, 
        min: [0, 'El stock no puede ser negativo'] 
    },
    availability: { 
        type: Boolean, 
        default: true 
    },
    sizes: { 
        type: [String], 
        default: ['S', 'M', 'L', 'XL'], 
        validate: {
            validator: function (arr) {
                return arr.every(size => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(size));
            },
            message: 'Talles no válidos'
        }
    },
    colors: { 
        type: [String], 
        default: ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde'] 
    },
    images: { 
        type: [String], 
        default: [] 
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

// Middleware para actualizar `updatedAt` antes de modificar un producto
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
