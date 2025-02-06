import mongoose from 'mongoose';

export const connectMongoDB = () => {
    mongoose.connect('mongodb://localhost:27017/Project01')
        .then(() => {
            console.log('Conectado a MongoDB');
        })
        .catch((error) => {
            console.error('Error al conectar a MongoDB', error);
        });
};
