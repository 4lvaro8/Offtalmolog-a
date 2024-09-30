import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importa íconos de react-icons
import 'bootstrap/dist/css/bootstrap.min.css';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estado para el modal de éxito
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            setShowSuccessModal(true);  // Muestra el modal de éxito
            setTimeout(() => {
                if (user.role === "doctor") {
                    navigate("/admin");  // Si el rol es "doctor", redirige al panel de admin
                } else {
                    navigate("/dashboard");  // Si es un usuario regular, redirige al dashboard
                }
            }, 3000);
        } else {
            alert("Error en el login, por favor verifica tus credenciales.");
        }
    };

    return (
        <div className="container-login d-flex justify-content-center align-items-center m-4 bg-white shadow-lg rounded ">
            <div className="bg-white p-4 rounded-4 shadow" style={{ maxWidth: '600px', height: '350px' }}>
                <h1 className="mb-4 text-center" style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#074173', // Color del título
                    textShadow: '1px 1px 2px #1679AB'
                }}>Bienvenido a Clínica Oftalmológica</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#074173', color: 'white' }}>
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                borderRadius: '0 5px 5px 0',
                                border: '1px solid #1679AB',
                            }}
                        />
                    </div>
                    <div className="mb-3 input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#074173', color: 'white' }}>
                            <FaLock />
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                borderRadius: '0 5px 5px 0',
                                border: '1px solid #1679AB',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-100 mt-3"
                        style={{
                            fontSize: '16px',
                            padding: '10px',
                            borderRadius: '30px',
                            transition: '0.3s',
                            background: 'linear-gradient(135deg, #074173 0%, #1679AB 100%)',
                            color: 'white',
                            border: 'none',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1679AB 0%, #074173 100%)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #074173 0%, #1679AB 100%)'}
                    >Iniciar Sesión</button>
                </form>
            </div>

            {showSuccessModal && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" style={{ backgroundColor: '#C5FF95' }}>
                        <div className="toast-header" style={{ backgroundColor: '#5DEBD7', color: '#074173' }}>
                            <strong className="me-auto">¡Bienvenido a Oftalmología Ventilador!</strong>
                        </div>
                        <div className="toast-body" style={{ color: '#074173' }}>
                            <p>Serás redirigido a tu Panel de Usuario en breve...</p>
                            <div className="progress mt-2" style={{ height: '5px' }}>
                                <div
                                    className="progress-bar progress-bar-striped"
                                    role="progressbar"
                                    style={{ backgroundColor: '#1679AB', width: '100%', transition: 'width 3s linear' }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
