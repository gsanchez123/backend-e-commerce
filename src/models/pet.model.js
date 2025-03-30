import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "El nombre es obligatorio"], 
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [30, "El nombre no puede superar los 30 caracteres"]
    },
    age: { 
        type: Number, 
        required: [true, "La edad es obligatoria"], 
        min: [0, "La edad no puede ser negativa"],
        max: [30, "La edad máxima permitida es 30 años"]
    },
    type: { 
        type: String, 
        required: [true, "El tipo de mascota es obligatorio"],
        enum: ["dog", "cat", "rabbit", "other"], 
        default: "other"
    },
    breed: { 
        type: String, 
        trim: true, 
        default: "Desconocida" 
    },
    gender: { 
        type: String, 
        enum: ["male", "female", "unknown"], 
        default: "unknown" 
    },
    isAdopted: { 
        type: Boolean, 
        default: false 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, "Debe haber un dueño asignado"]
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// 🔹 Middleware para capitalizar el nombre antes de guardar
petSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    }
    next();
});

// 🔹 Índice para optimizar búsquedas por dueño
petSchema.index({ owner: 1 });

const PetModel = mongoose.model("Pet", petSchema);

export default PetModel;
