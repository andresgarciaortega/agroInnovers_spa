// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { IoMdNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


import { getDecodedToken } from './../utils/auseAuth'; // Ajusta la ruta según tu proyecto



const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const [logoUser, setLogoUser] = useState(null);


  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const decodedToken = await getDecodedToken(); // Espera la resolución de la promesa
      if (decodedToken) {
        // Accede a los valores del token y actualiza el estado
        setUsername(decodedToken.name); 
        setEmailUser(decodedToken.email);
        setLogoUser(decodedToken?.company.logo)
      }
    };

    fetchUserData(); // Llama a la función asíncrona
  }, []);


  return (
    <div className="flex justify-end items-center p-4">
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <IoMdNotificationsOutline className="text-2xl text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>
        <img src={logoUser} alt="User" className="h-8 w-8 rounded-full" />
        <div onClick={toggleDropdown}>
          <p className="text-gray-700">{username}</p>
          <small className="text-gray-500">{emailUser}</small>
        </div>
        <IoIosArrowDown className="text-gray-600 cursor-pointer" onClick={toggleDropdown} />
        {dropdownOpen && (
          <div className="absolute right-0 mt-36 w-48 bg-white rounded-lg shadow-lg z-10">
            <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => alert("Aun no disponible")}>Perfil</button>
            <button 
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200" 
              onClick={handleLogout} 
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
