import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

dotenv.config(); // Carga variables de entorno desde .env

// Configuración para JWT
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
};

// Estrategia JWT para autenticación basada en tokens
passport.use(new JwtStrategy(jwtOpts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.error('❌ Error en estrategia JWT:', error.message);
        return done(error, false);
    }
}));

// Estrategia Local para autenticación con usuario y contraseña
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' }, 
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            // Verificar contraseña con bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            console.error('❌ Error en estrategia Local:', error.message);
            return done(error);
        }
    }
));

// Serialización y deserialización de usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
