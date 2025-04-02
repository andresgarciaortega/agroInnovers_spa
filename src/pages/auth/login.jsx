import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import logo from "../../assets/imagenes/logoBlanco.jpg";
import logoSena from "../../assets/imagenes/sena.jpg";
import logoMin from "../../assets/imagenes/ciencia.png";
import AccesUser from '../../services/authService';
import './auth.css'
import { IoIosEye } from "react-icons/io";
import ErrorAlert from '../../components/alerts/error';
import { getDecodedToken } from '../../utils/auseAuth';
import { useCompanyContext } from '../../context/CompanyContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [data, setData] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    setShowErrorAlert(false);
  }, [])
  
  const { setSelectedCompanyUniversal } = useCompanyContext(); // Añade esto
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear();

    // 1. Intentar obtener UUID del dispositivo (maneja silenciosamente el error)
    let uuidObtenido=''
    try {
      const uuidResponse = await fetch('http://localhost:1880/serial_id');
      if (uuidResponse.ok) {
        const uuid = await uuidResponse.json();
        if (uuid?.serial_pi) {
          uuidObtenido = uuid.serial_pi;
          localStorage.setItem("uuid", uuid.serial_pi);
        }
      }
    } catch (uuidError) {
      console.log("No se pudo obtener UUID (esto es normal en desarrollo)");
    }


    const accesUser = await AccesUser.accesUsersLoguin({ email, password });

    if (accesUser.error) {
      localStorage.setItem('authToken', accesUser.response);
      const decodedToken = await getDecodedToken();

      if(decodedToken?.roles[0].name == 'SUPER-ADMINISTRADOR' && uuidObtenido !== ''){
        localStorage.removeItem('authToken');
        localStorage.removeItem('selectedCompany');
        localStorage.clear();
        navigate('/');
      }else{
        // Crear objeto empresa
        const companyData = {
          value: decodedToken?.company.id,
          label: decodedToken?.company.name,
        };
  
        // Actualizar localStorage
        localStorage.setItem("selectedCompany", JSON.stringify(companyData));
  
        // Actualizar contexto de empresa (nuevo código)
        if (setSelectedCompanyUniversal) {
          setSelectedCompanyUniversal(companyData);
        }
  
        localStorage.setItem("rol", JSON.stringify(
          {
            "value": decodedToken?.roles[0].id,
            "label": decodedToken?.roles[0].name,
          }
        ));
  
        setTimeout(() => {
          navigate('/home/dashboard', { replace: true });
        }, 600);
      }
    } else {
      // Error: muestra la alerta (condición original mantenida)
      setEmailError(true);
      setPasswordError(true);
      setErrorMessage(accesUser.message);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 1200);
    }
  };

  const handleCloseAlert = () => {
    localStorage.clear();
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Innovers Logo" className="h-14" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email"
                className={`block text-sm font-bold mb-2 ${emailError ? 'text-red-500' : 'text-gray-700'}`}>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">Credenciales incorrectas. Por favor, inténtalo de nuevo.</p>}
            </div>
            <div className="mb-6 inputPassword">
              <label htmlFor="password"
                className={`block text-sm font-bold mb-2 ${emailError ? 'text-red-500' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError ? 'border-red-500' : ''}`}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                required
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">Credenciales incorrectas. Por favor, inténtalo de nuevo.</p>}
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="text-sm text-gray-600">
                  Recuérdame
                </label>
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="text-sm text-cyan-500 hover:text-cyan-800"
                  onClick={() => navigate('../passwordRecovery')}
                >
                  ¿Olvidaste tu contraseña?
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </button>
                {/* {showForgotPassword && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Recuperar contraseña
                    </a>
                  </div>
                )} */}
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mb-5">
              <a
                href="/document/politicasprivacidad.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-800"
              >
                Políticas de privacidad
              </a>
            </p>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-[#168C0DFF] hover:bg-[#345246] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ingresar
              </button>
            </div>

            <div className="contenedorImagenLogo">
              <img src={logoSena} alt="Innovers Sena" className="h-14" />
              <img src={logoMin} alt="Innovers Min Ciencia" className="h-14 min" />
            </div>



          </form>

        </div>
      </div>
      {showErrorAlert && (
        <ErrorAlert
          message={errorMessage}
          onCancel={handleCloseAlert}
        />
      )}

    </div>
  );

};

export default Login;
