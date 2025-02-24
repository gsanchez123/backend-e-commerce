import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    return (
        <nav className="navbar">
            <Link to="/">Trendify</Link>
            <Link to="/products">Productos</Link>
            <Link to="/cart">Carrito ({cart.length})</Link>
            <Link to="/chat">Chat</Link>
            {user ? (
                <>
                    <span>Hola, {user.name}</span>
                    <button onClick={logout}>Cerrar Sesión</button>
                </>
            ) : (
                <>
                    <Link to="/login">Iniciar Sesión</Link>
                    <Link to="/register">Registrarse</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
