import React from "react";
import Menu from "../../components/Menu"; 
import { useNavigate } from 'react-router-dom';


const Espacio = () => {
    const navigate = useNavigate();
  
  return (
    <div>
     <button className="bg-[#168C0DFF] text-white px-6 py-2 rounded-lg flex items-center" onClick={() => navigate('../crearEspacio')}>

Crear espacio
</button>
      
      <h1> Espacio</h1>
    </div>
  );
};

export default Espacio;
