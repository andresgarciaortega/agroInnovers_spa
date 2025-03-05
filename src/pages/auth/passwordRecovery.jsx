import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import logo from "../../assets/imagenes/logoBlanco.jpg";
import "./auth.css";
import ErrorAlert from "../../components/alerts/error";
import AccesUser from "../../services/authService";
import LoadingView from "../../components/Loading/loadingView";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [classStyle, setClassStyle] = useState()
  const [messajeAlert, setMessajeAlert] = useState()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (email) {
      const response = await AccesUser.recoveryPassword({ email })
      setIsSubmitted(true);
      if (response.success) {
        setMessajeAlert(response.message)
        setTimeout(() => setShowErrorAlert(false), 1200);
        setClassStyle('green');
        setIsLoading(false);
      } else {
        setMessajeAlert(response.message);
        setClassStyle('red');
        setTimeout(() => setShowErrorAlert(false), 1200);
        setIsLoading(false);
      }
    } else {
      setErrorMessage(response.message);
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
        {/* {isSubmitted ? (
          <div class="text-center">
            <div role="status">
              <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : ''} */}

        <form onSubmit={handleSubmit}>
          {isSubmitted ? (
            <div className={`rounded-md bg-${classStyle}-50 p-4 border border-${classStyle}-500 p-4`}>
              <p className={`text-sm text-${classStyle}-700 text-center`}>
                {messajeAlert}
              </p>
            </div>
          ) : ''}

          <br />
          <div className="mb-4 bt-4">
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


          <button
            type="submit"
            className="w-full bg-[#168C0DFF] hover:bg-green-700 text-white font-bold py-2 rounded focus:outline-none"
          >
            Enviar correo
          </button>

        </form>
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


      </div>

      {showErrorAlert && (
        <ErrorAlert message={errorMessage} onCancel={handleCloseAlert} />
      )}
    </div>
  );
};

export default PasswordRecovery;
