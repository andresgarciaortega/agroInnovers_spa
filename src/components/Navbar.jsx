import React, { useEffect, useState } from 'react';
import { IoMdNotificationsOutline, IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getDecodedToken } from './../utils/auseAuth'; // Ajusta la ruta según tu proyecto
import CompanySelector from './shared/companySelect';
import FormUser from '../pages/usuarios/FormUser/formUser'; // Importa FormUser

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const [logoUser, setLogoUser] = useState(null);
  const [userRoles, setUserRoles] = useState(JSON.parse(localStorage.getItem('rol')));
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [modalMode, setModalMode] = useState('view'); // Estado para controlar el modo del modal

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const decodedToken = await getDecodedToken();
      if (decodedToken) {
        console.log(decodedToken)
        setUsername(decodedToken.name);
        setEmailUser(decodedToken.email);
        setLogoUser(decodedToken?.campaign.logo);
        // setUserRoles(decodedToken.roles?.map(role => role.name) || []);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      icon: 'question',
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('selectedCompany');
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const handleProfileClick = () => {
    setModalMode('edit'); // Cambia a 'view' si solo quieres ver el perfil
    setIsModalOpen(true); // Abre el modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
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
    <div className="flex justify-between items-center p-6 px-8 contenedorNabvar ">
      <div className=" w-100 selectoraUniversal h-10">
        {userRoles?.label === 'SUPER-ADMINISTRADOR' && <CompanySelector />}
      </div>

      <div className="flex w-80 items-center space-x-4 infosessionperfil ">
        <img src={logoUser} alt="User" className="h-9 w-9 rounded-lg border" />
        <div onClick={toggleDropdown} className='seccionNombreUser'>
          <p className="text-gray-700">{username}</p>
          <small className="text-gray-500">{emailUser}</small>
        </div>
        <IoIosArrowDown className="text-gray-600 cursor-pointer " onClick={toggleDropdown} />
        {dropdownOpen && (
          <div className="absolute right-20 mt-36 w-[150px]  bg-white rounded-lg shadow-lg z-10 ">
            {/* <MenuItem onClick={handleProfileClick}>Perfil</MenuItem> */}
            <MenuItem onClick={handleLogout}>Salir</MenuItem>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;