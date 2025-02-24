import { useCart } from '../hooks/useCart';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="card">
            <img src={product.thumbnail} alt={product.name} className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price}</p>
                <button className="btn btn-primary" onClick={() => addToCart(product)}>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
