// src/app.js
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { connectDB } from './config/db.js';
import './config/passport.js'; // Configura la estrategia de Passport
import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/users.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import { MailingService } from './services/mailing.service.js';
import { TwilioService } from './services/twilio.service.js';

dotenv.config();

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación y servidor HTTP
const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO (para chat en vivo, etc.)
const io = new Server(server, { cors: { origin: '*' } });

// Configuración de Handlebars con layouts y partials
app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        extname: '.handlebars'
    })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Conexión a la Base de Datos
connectDB();

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

// Ruta raíz (puedes renderizar una vista de bienvenida)
app.get('/', (req, res) => {
    res.render('home', { title: 'Trendify - Inicio' });
});

// Configuración de WebSocket para chat en vivo
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Permitir que otros módulos accedan a la instancia de Socket.IO
app.set('io', io);

// Middleware de manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
