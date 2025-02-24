import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(formData);
            Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "¡Bienvenido! Ahora puedes iniciar sesión.",
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error en el registro",
                text: error.response?.data?.message || "Hubo un problema. Inténtalo de nuevo.",
            });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Registro de Usuario</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                </button>
            </form>
            <p className="mt-3 text-center">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
        </div>
    );
};

export default Register;
