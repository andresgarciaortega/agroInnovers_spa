import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "../../assets/imagenes/logoBlanco.jpg";
import "./auth.css";
import ErrorAlert from "../../components/alerts/error";
import AccesUser from "../../services/authService";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (email) {
      setIsSubmitted(true);

      const response = await AccesUser.ResetPasswordUser({email })
      console.log(response)
      showErrorAlert(response)
      setTimeout(() => setShowErrorAlert(false), 1200);
    } else {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 1200);
    }
  };

  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-14" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-gray-700 text-center mb-5">
          Ingresa el correo con el que te registraste para enviarte un enlace de recuperación
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-700 text-sm font-bold mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 pl-10 pr-3 rounded border shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center mb-5"
              >
                Recuerdas tu contraseña? {" "}
                <span className="text-cyan-500 border-b-2 border-cyan-400">
                  Iniciar sesión
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#168C0DFF] hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none"
            >
              Enviar correo
            </button>

          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-700 text-center">
                Revisa tu bandeja de entrada para recuperar tu contraseña
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#168C0DFF] hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none"
            >
              iniciar sesión
            </button>
          </div>
        )}


      </div>

      {showErrorAlert && (
        <ErrorAlert message={errorMessage} onCancel={handleCloseAlert} />
      )}
    </div>
  );
};

export default PasswordRecovery;
