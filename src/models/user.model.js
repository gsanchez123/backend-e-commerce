import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'El correo es obligatorio'], 
        unique: true, 
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Correo electrónico no válido']
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'], 
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'] 
    },
    phoneNumber: { 
        type: String, 
        unique: true, 
        sparse: true, // Permite valores nulos pero únicos si se ingresan
        match: [/^\+\d{1,3}\d{7,14}$/, 'Número de teléfono no válido']
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model('User', userSchema);
