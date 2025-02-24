import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/products");
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setProducts([]);
                    setError("Los productos no se pudieron cargar.");
                }
            } catch (err) {
                console.error("⚠️ Error cargando productos:", err);
                setError("Error cargando productos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Lista de Productos</h2>
            {products.length === 0 ? (
                <p>No hay productos disponibles.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>{product.name} - ${product.price}</li>
                    ))}
                </ul>
            )}
        </div>

        
    );
};

export default Products;
