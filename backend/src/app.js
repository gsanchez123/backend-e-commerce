// importaciones principales
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

import { connectDB } from './config/db.js';
import './config/passport.js';

import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/users.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import mocksRouter from './routes/mocks.routes.js';
import adoptionRoutes from './routes/adoption.routes.js';

import { MailingService } from './services/mailing.service.js';
import { TwilioService } from './services/twilio.service.js';
import Product from './models/products.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

//  Seguridad
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
}));

// CORS Seguro
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

//  Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//  Manejo de JSON inválido
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: "error", message: "JSON inválido" });
    }
    next();
});

//  Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
    .then(() => console.log('🔥 Conectado a la base de datos'))
    .catch(err => console.error('❌ Error en la base de datos:', err));

// 🌐 Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🚀 Rutas API
app.use('/api/mocks', mocksRouter);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/adoptions', adoptionRoutes); // ✅ NUEVA RUTA INCLUIDA

//  Rutas de prueba de mailing y Twilio
app.post('/api/testmail', async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        await MailingService.sendMail({ to, subject, html });
        res.json({ message: 'Email enviado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/testtwilio', async (req, res) => {
    try {
        const { to, body } = req.body;
        await TwilioService.sendMessage({ to, body });
        res.json({ message: 'Mensaje enviado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  WebSocket para productos y chat
const io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true }
});

io.on('connection', async (socket) => {
    console.log('✅ Cliente conectado');

    try {
        const products = await Product.find();
        socket.emit('updateProducts', products);
    } catch (err) {
        console.error('Error obteniendo productos:', err);
    }

    socket.on('addProduct', async (productData) => {
        try {
            const newProduct = await Product.create(productData);
            const allProducts = await Product.find();
            io.emit('updateProducts', allProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const allProducts = await Product.find();
            io.emit('updateProducts', allProducts);
            io.emit('productDeleted', 'Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

app.set('io', io);

// ⚠️ Middleware global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 📦 Servir frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 🔥 Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
