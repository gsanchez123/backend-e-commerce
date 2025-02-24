import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Crear contexto
const AuthContext = createContext();

// URL base del backend
const API_URL = "http://localhost:3000/api/auth";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/current`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.warn("⚠️ No hay sesión activa:", error.response?.status || error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/login`,
                { email, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setUser(response.data.user);
                setError(null);
            }

            return response.data;
        } catch (error) {
            console.error("⚠️ Error en login:", error.response?.data?.message || error.message);
            setError("Error en inicio de sesión");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            setUser(null);
            setError(null);
        } catch (error) {
            console.error("⚠️ Error en logout:", error.response?.data?.message || error.message);
            setError("Error cerrando sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para consumir el contexto de autenticación
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};

// Exportaciones consistentes para evitar problemas con Vite HMR
export { AuthProvider, AuthContext, useAuth };
