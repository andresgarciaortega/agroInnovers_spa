import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from "../assets/imagenes/logo.jpeg";
import logoUser from "../assets/icons/user2.png";
import { FaRegBuilding, FaTv, FaBars } from 'react-icons/fa';
import { RxDashboard } from "react-icons/rx";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsBox } from "react-icons/bs";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import { LiaFishSolid } from "react-icons/lia";
import { FaMicrochip } from "react-icons/fa6";
import { ImEqualizer2 } from "react-icons/im";
import { IoMdNotificationsOutline, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import Navbar from "./Navbar";
import './menu.css';


const menuItems = [
  { icon: <RxDashboard />, label: "Dashboard", route: "/home/dashboard" },
  { icon: <FaRegBuilding />, label: "Empresa", route: "/home/empresa" },
  { icon: <HiOutlineUserGroup />, label: "Usuarios", route: "/home/usuarios" },
  { 
    icon: <ImEqualizer2 />, 
    label: "Gestionar variables", 
    submenu: [
      
      { label: "Tipo de Variables", route: "/home/tipoVariables" },
      { label : "Variables", route: "/home/variables" }
    ]
  },
  { 
    icon: <LiaFishSolid />, 
    label: "Gestionar especies ", 
    submenu: [
      { label : "Categorias", route: "/home/especies" },
      { label: "Lista de especies", route: "/home/listaEspecie" }
    ]
  },
  { icon: <FaTv />, label: "Sistema de monitoreo", route: "/home/monitoreo" },
  { 
    icon: <FaMicrochip />, 
    label: "Gestionar dispositivos ", 
    submenu: [
      { label: "Tipos de dispositivos", route: "/home/tipos" },
      { label: "Sensores", route: "/home/sensor" },
      { label: "Actuadores", route: "/home/actuador" }
    ]
  },
  { 
    icon: <BsBox />, 
    label: "Gestionar espacios ", 
    submenu: [
      { label: "Tipos de espacios", route: "/home" },
      { label: "Espacios", route: "/home" }
    ]
  },
  { icon: <PiArrowsCounterClockwiseBold />, label: "Lotes de producción", route: "/home" },
];

const Sidebar = ({ selectedItem, setSelectedItem }) => {
  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = useState(null); 

  const handleClick = (route, index) => {
    setSelectedItem(index);
    navigate(route);
  };

  const handleSubMenuClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index); 
  };

  return (
    <nav className="w-full md:max-w-72 bg-[#345246] text-white flex flex-col h-full">
      <div className="p-2 flex justify-center">
        <img src={logo} alt="Logo" className="h-20" />
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-lg ${
                selectedItem === index ? 'bg-[#168C0DFF]' : 'bg-transparent'
              }`}
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
                  <button
                    key={subIndex}
                    className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-xl ${
                      selectedItem === `${index}-${subIndex}` ? 'bg-[#168C0DFF]' : 'bg-transparent'
                    }`}
                    onClick={() => handleClick(subItem.route, `${index}-${subIndex}`)}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default function Component() {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="flex h-screen bg-gray-100">
      {isMobileView ? (
        <>
          <button
            className="absolute top-4 left-4 p-2 bg-[#345246] rounded z-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="text-white text-2xl" />
          </button>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
              <div className="w-64 h-full">
                <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      )}
      
      <div className="flex-1" >
      <Navbar />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
