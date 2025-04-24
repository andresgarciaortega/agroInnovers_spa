

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/icons/agronovers_logo.png";
import { FaRegBuilding, FaTv, FaBars } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsBox } from "react-icons/bs";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { BiWorld } from "react-icons/bi";
import { FaMicrochip } from "react-icons/fa6";
import { ImEqualizer2 } from "react-icons/im";
import { IoMdNotificationsOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import Navbar from "./Navbar";
import './menu.css';
import { getDecodedToken } from '../utils/auseAuth';

// Menu items with roles allowed
const menuItems = [
  // Solo accesible por SUPER-ADMINISTRADOR y ADMINISTRADOR
  {
    icon: <RxDashboard />,
    label: "Dashboard",
    route: "/home/dashboard",
    
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"]
  },
  // Solo accesible por SUPER-ADMINISTRADOR
  {
    icon: <FaRegBuilding />,
    label: "Empresa",
    route: "/home/empresa",
    roles: ["SUPER-ADMINISTRADOR"]
  },
  // Accesible por SUPER-ADMINISTRADOR y ADMINISTRADOR
  {
    icon: <HiOutlineUserGroup />,
    label: "Usuarios",
    route: "/home/usuarios",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR"]
  },
  // Submenú accesible por SUPER-ADMINISTRADOR y ADMINISTRADOR
  {
    icon: <ImEqualizer2 />,
    label: "Gestionar variables",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"],
    submenu: [
      { label: "Tipo de Variables", route: "/home/tipoVariables", roles: ["SUPER-ADMINISTRADOR"] },
      { label: "Variables", route: "/home/variables", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
    ],
  },
  // Submenú accesible por todos los roles
  {
    icon: <BiWorld />,
    label: "Gestionar especies",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"],
    submenu: [
      { label: "Categorias", route: "/home/especies", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
      { label: "Lista de especies", route: "/home/listaEspecie", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
    ],
  },
  // Accesible solo por ADMINISTRADOR y SUPER-ADMINISTRADOR
  {
    icon: <FaTv />,
    label: "Sistema de monitoreo",
    route: "/home/monitoreo",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"]
  },
  // Submenú accesible por ADMINISTRADOR y SUPER-ADMINISTRADOR
  {
    icon: <FaMicrochip />,
    label: "Gestionar dispositivos",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"],
    submenu: [
      { label: "Tipos de dispositivos", route: "/home/tipos", roles: ["SUPER-ADMINISTRADOR"] },
      { label: "Sensores", route: "/home/sensor", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
      { label: "Actuadores", route: "/home/actuador", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
    ],
  },
  // Submenú accesible por todos los roles
  {
    icon: <BsBox />,
    label: "Gestionar espacios",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"],
    submenu: [
      { label: "Tipos de espacios", route: "/home/tipoEspacio", roles: ["SUPER-ADMINISTRADOR"] },
      { label: "Espacios", route: "/home/espacio", roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"] },
    ],
  },
  // Accesible solo por OPERARIO
  {
    icon: <PiArrowsCounterClockwiseBold />,
    label: "Lotes de producción",
    route: "/home/lotes",
    roles: ["SUPER-ADMINISTRADOR", "ADMINISTRADOR", "OPERARIO"]
  },
];


const Sidebar = ({ selectedItem, setSelectedItem, userRoles }) => {
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation(); // Captura la ruta actual

  const handleClick = (route, index) => {
    setSelectedItem(index);
    navigate(route);
  };

  const handleSubMenuClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const hasAccess = (roles) => roles.some(role => userRoles.includes(role));

  return (
    <nav className="w-full md:max-w-80 bg-[#345246] text-white flex flex-col h-full menucompleto">
      <div className="p-2 flex justify-center">
        <img src={logo} alt="Logo" className="logoDashboard" />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {menuItems.map((item, index) => (
          hasAccess(item.roles) && (
            <div key={index}>
              <button
                // className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-lg ${selectedItem === index ? 'bg-[#168C0DFF]' : 'bg-transparent'}`}
                className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-xl ${location.pathname === item.route ? 'bg-[#168C0DFF]' : 'bg-transparent'}`}
                onClick={() => item.submenu ? handleSubMenuClick(index) : handleClick(item.route, index)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.submenu && (
                  <span className="ml-auto">
                    {openSubMenu === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                )}
              </button>

              {item.submenu && openSubMenu === index && (
                <div className="pl-8">
                  {item.submenu.map((subItem, subIndex) => (
                    hasAccess(subItem.roles) && (
                      <button
                        key={subIndex}
                        className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-xl ${location.pathname === subItem.route ? 'bg-[#168C0DFF]' : 'bg-transparent'
                          }`}
                        onClick={() => handleClick(subItem.route, `${index}-${subIndex}`)}
                      >
                        {subItem.label}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </nav>
  );
};

export default function Component() {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1068);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDecodedToken = async () => {
      try {
        const decodedToken = await getDecodedToken();
        setUserRoles(decodedToken.roles?.map(role => role.name) || []);
      } catch (error) {
        console.error("Error obteniendo el token decodificado:", error);
      }
    };

    fetchDecodedToken();
  }, []);



  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {isMobileView ? (
        <>
          <button
            className="absolute top-6 right-4 p-2 bg-[#345246] rounded z-20 "
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="text-white text-2xl " />
            ) : (
              <FaBars className="text-white text-2xl " />
            )}
          </button>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10 ">
              <div className="w-66 h-full">
                <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} userRoles={userRoles} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} userRoles={userRoles} />
      )}

      <div className="flex-1">
        <Navbar onLogout={handleLogout} />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}