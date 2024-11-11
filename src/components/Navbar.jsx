import React, { useEffect, useState } from 'react';
import { IoMdNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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

  useEffect(() => {
    const fetchUserData = async () => {
      const decodedToken = await getDecodedToken();
      if (decodedToken) {
        setUsername(decodedToken.name);
        setEmailUser(decodedToken.email);
        setLogoUser(decodedToken?.company.logo);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Desea cerrar sesión?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonColor: "rgb(200,40,20)",
      confirmButtonText: "Si",
      cancelButtonColor: "rgb(40,150,20)",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sesión finalizada.", "", "success");
        navigate('/');
      }
    });
  };

  // Componente MenuItem personalizado
  const MenuItem = ({ onClick, children }) => (
    <button 
      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="flex justify-end items-center p-6 px-8">
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
        <IoIosArrowDown className="text-gray-600 cursor-pointer " onClick={toggleDropdown} />
        {dropdownOpen && (
          <div className="absolute right-0 mt-36 w-[220px]  bg-white rounded-lg shadow-lg z-10 ">
            <MenuItem onClick={() => navigate('/perfil')}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Salir</MenuItem>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
