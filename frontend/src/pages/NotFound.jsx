import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 text-danger fw-bold">404</h1>
            <h2 className="text-dark">¡Oops! Página no encontrada</h2>
            <p className="text-muted">
                Lo sentimos, la página que buscas no existe o ha sido eliminada.
            </p>

            <img 
                src="/img/404-error.svg" 
                alt="Página no encontrada" 
                className="img-fluid my-4" 
                style={{ maxWidth: '400px' }} 
            />

            <Link to="/" className="btn btn-primary btn-lg">
                <i className="fas fa-home"></i> Volver al inicio
            </Link>
        </div>
    );
};

export default NotFound;
