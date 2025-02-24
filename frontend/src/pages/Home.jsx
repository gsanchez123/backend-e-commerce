import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1>Bienvenido a Trendify</h1>
            <p>Compra la mejor moda urbana y deportiva</p>
            <Link to="/products" className="btn btn-primary">Ver productos</Link>
        </div>
    );
};

export default Home;
