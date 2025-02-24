import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartWidget = () => {
    const { cart } = useCart();

    return (
        <Link to="/cart" className="btn btn-outline-light">
            🛒 {cart.length}
        </Link>
    );
};

export default CartWidget;
