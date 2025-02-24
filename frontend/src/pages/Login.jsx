import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate('/profile');
    };

    return (
        <div className="container mt-4">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="form-control" />
                <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} className="form-control mt-2" />
                <button type="submit" className="btn btn-primary mt-3">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
