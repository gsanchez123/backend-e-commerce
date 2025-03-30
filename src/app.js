import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import './config/passport.js'; // Configuración de Passport
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/users.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import mocksRouter from './routes/mocks.routes.js'; // 📌 Nuevo router para Mocking
import { MailingService } from './services/mailing.service.js';
import { TwilioService } from './services/twilio.service.js';
import Product from './models/products.model.js'; // Modelo de productos

dotenv.config();

// Obtiene __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación y servidor HTTP
const app = express();
const server = http.createServer(app);

// 🔹 Configuración de CORS Seguro (Permite solo localhost y producción)
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true // Permite cookies y autenticación con credenciales
}));

// Middleware para manejar JSON mal formateado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Captura errores de JSON inválidos
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: "error", message: "JSON inválido en la solicitud" });
    }
    next();
});

// Conexión a la Base de Datos con Mongoose
mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce")
    .then(() => console.log("🔥 Conectado a la base de datos"))
    .catch((err) => console.error("Error al conectar con la base de datos:", err));

// Servir el frontend de React desde `frontend/dist`
app.use(express.static(path.join(__dirname, '../frontend/dist')));

//Registra el router de Mocking
app.use('/api/mocks', mocksRouter);

// Rutas de la API
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rutas de prueba para mailing y Twilio
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

// Configuración de WebSocket para chat en vivo y productos en tiempo real
const io = new Server(server, { 
    cors: { origin: allowedOrigins, credentials: true } 
});

io.on('connection', async (socket) => {
    console.log('✅ Nuevo cliente conectado');

    // Emitir productos iniciales al usuario que se conecta
    try {
        const products = await Product.find();
        socket.emit('updateProducts', products);
    } catch (err) {
        console.error('Error al obtener productos:', err);
    }

    // Agregar un nuevo producto
    socket.on('addProduct', async (productData) => {
        try {
            const newProduct = await Product.create(productData);
            const allProducts = await Product.find();
            io.emit('updateProducts', allProducts);
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    // Eliminar un producto
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

    // Mensajería en vivo
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

// Permitir que otros módulos accedan a la instancia de Socket.IO
app.set('io', io);

// Middleware de manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Servir React en todas las rutas no manejadas por la API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
