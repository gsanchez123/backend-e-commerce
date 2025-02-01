import mongoose from 'mongoose';

export const connectMongoDB = () => {
    mongoose.connect('mongodb://localhost:27017/Project01', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).then(() => {
        console.log('Conectado a MongoDB');
    }).catch((error) => {
        console.log('Error al conectar a MongoDB', error);
    });
};
