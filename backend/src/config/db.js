import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Project01';

        // Opciones de conexión actualizadas para evitar advertencias
        mongoose.set('strictQuery', false); 

        await mongoose.connect(mongoURI);

        console.log('✅ Conectado a MongoDB correctamente');

        // Solo mostrar la URI en modo desarrollo 
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📡 Conectado a: ${mongoURI}`);
        }
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1); // Termina el proceso si la conexión falla
    }
};

