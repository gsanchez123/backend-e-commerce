import { useAuth } from '../hooks/useAuth';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return <p>Cargando...</p>;

    return (
        <div className="container mt-4">
            <h2>Perfil de {user.name}</h2>
            <p>Email: {user.email}</p>
            <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default Profile;
