// src/components/Navbar.jsx
import React, { useState } from 'react';
import { IoMdNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import logoUser from "../assets/icons/user2.png";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <div className="flex justify-end items-center p-4">
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <IoMdNotificationsOutline className="text-2xl text-gray-600" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>
        <img src={logoUser} alt="User" className="h-8 w-8 rounded-full" />
        <div onClick={toggleDropdown}>
          <p className="text-gray-700">Yeison Barrios Funieles</p>
          <small className="text-gray-500">yeison@gmail.com</small>
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
