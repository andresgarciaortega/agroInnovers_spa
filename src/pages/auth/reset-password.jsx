import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "../../assets/imagenes/logoBlanco.jpg";
import logoSena from "../../assets/imagenes/sena.jpg";
import logoMin from "../../assets/imagenes/ciencia.png";
import "./auth.css";
import ErrorAlert from "../../components/alerts/error";
import AccesUser from "../../services/authService";
import { IoIosEye } from "react-icons/io";

const ResetPassword = () => {
    const [newPassword, setnewPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleSubmit = async (e) => {
        console.log("response 1")

        e.preventDefault();

        // Obtener el token desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
            showErrorAlert("Token no encontrado en la URL");
            return;
        }
        console.log("response")
        try {
            showErrorAlert("Contraseña actualizada correctamente");
            setTimeout(() => setShowErrorAlert(false), 1000);
            navigate('/', { replace: true });
            const response = await AccesUser.ResetPasswordUser(newPassword, token);
        } catch (error) {
            console.log("error : ", error)
        }

        // } else {
        //     showErrorAlert(response.message || "Error al actualizar la contraseña");
        // }
    };


    const handleCloseAlert = () => {
        setShowErrorAlert(false);
    };



    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const validatePassword = () => {
        if (newPassword !== confirmPassword) {
            setEmailError(true)
            setPasswordError(true)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-14" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                    Actualizar contraseña
                </h2>
                <p className="text-sm text-gray-700 text-center mb-5">
                    Ingresa la nueva contraseña.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email"
                            className={`block text-sm font-bold mb-2 ${emailError ? 'text-red-500' : 'text-gray-700'}`}>
                            Nueva Contraseña
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="email"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
                            placeholder="Correo electrónico"
                            value={newPassword}
                            onChange={(e) => {
                                setnewPassword(e.target.value);
                                setEmailError(false);
                            }}
                            required
                        />
                        {emailError && <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden.</p>}
                    </div>
                    <div className="mb-6 inputPassword">
                        <label htmlFor="password"
                            className={`block text-sm font-bold mb-2 ${emailError ? 'text-red-500' : 'text-gray-700'}`}>
                            Confirmar Contraseña
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
                            placeholder="Contraseña"
                            value={confirmPassword}
                            onBlur={validatePassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError(false);
                            }}
                            required
                        />
                        {passwordError && <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden.</p>}
                        <span className='ver'
                            onClick={togglePasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                cursor: 'pointer',
                                color: showPassword ? 'blue' : 'gray',
                            }}
                        ><IoIosEye /></span>
                    </div>
                    <div className="mb-6">
                        <button
                            type="submit"
                            className="w-full bg-[#168C0DFF] hover:bg-[#345246] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Guardar
                        </button>
                    </div>

                    <div className="contenedorImagenLogo">
                        <img src={logoSena} alt="Innovers Sena" className="h-14" />
                        <img src={logoMin} alt="Innovers Min Ciencia" className="h-14 min" />
                    </div>
                </form>
            </div>

            {showErrorAlert && (
                <ErrorAlert message={errorMessage} onCancel={handleCloseAlert} />
            )}
        </div>
    );
};

export default ResetPassword;


