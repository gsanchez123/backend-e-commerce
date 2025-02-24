import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart } = useCart();

    return (
        <div className="container mt-4">
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="cart-item">
                        <p>{item.name} - ${item.price}</p>
                        <button onClick={() => removeFromCart(item.id)} className="btn btn-danger">Eliminar</button>
                    </div>
                ))
            )}
            <Link to="/checkout" className="btn btn-success mt-3">Finalizar Compra</Link>
        </div>
    );
};

export default Cart;
