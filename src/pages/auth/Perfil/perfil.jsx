import React, { useEffect, useState } from "react";
import { Edit2Icon, ArrowLeft  } from "lucide-react";
import { Link } from 'react-router-dom'; 
import { getDecodedToken } from '../../../utils/auseAuth';// Ajusta la ruta según tu proyecto

export default function Perfil() {
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoContraseña, setEditandoContraseña] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [roles, setRoles] = useState(null);
  const [documento, setDocumento] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [contraseña, setContraseña] = useState('********');
  const [fotoFondo, setFotoFondo] = useState('');
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const decodedToken = await getDecodedToken();
      if (decodedToken) {
        setNombre(decodedToken.name);
        setCorreo(decodedToken.email);
        setCelular(decodedToken.phone);
        setDocumento(decodedToken.document);
        setRoles(decodedToken.roles);
        setFechaRegistro(decodedToken.registrationDate);
        setFotoFondo(decodedToken.company.logo);  
        setEmpresa(decodedToken.company);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
  <div className="container mx-auto px-6">
    <div className="max-w-3xl mx-auto bg-gray-100 shadow-md shadow-[#345246] rounded-lg">
      <div className=" pb-8">
      <Link to="/home" className="absolute top-5 left-5 text-2xl text-gray-800">
                <ArrowLeft className="h-6 w-6 text-gray-800" /> {/* Ícono de flecha */}
              </Link>
        <div className="text-center mb-8">
          {fotoFondo && (
            <img
              src={fotoFondo}
              alt="Logo de la empresa"
              className="w-full h-auto object-cover mb-4 rounded-lg" 
            />
          )}

          {editandoNombre ? (
            <div className="flex justify-center items-center mb-2">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="max-w-xs mr-2"
              />
              <button onClick={() => setEditandoNombre(false)}>Guardar</button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-2 flex justify-center items-center">
              {nombre}
              <button
                variant="ghost"
                size="icon"
                onClick={() => setEditandoNombre(true)}
                className="ml-2"
              >
                <Edit2Icon className="h-4 w-4" />
              </button>
            </h1>
          )}
         <p className="text-gray-600">{roles && roles.length > 0 ? roles[0].name : 'Rol no disponible'}</p>

        </div>
        

        <div className="grid grid-cols-2 gap-6 px-8" >
          <div>
            <label>Correo</label>
            <p className="text-gray-700">{correo}</p>
          </div>
          <div className="col-span-1">
            <label>Contraseña</label>
            {editandoContraseña ? (
              <div className="flex items-center">
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="mr-2"
                />
                <button onClick={() => setEditandoContraseña(false)}>Guardar</button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-700 mr-2">{contraseña}</p>
                <button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditandoContraseña(true)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label>Celular</label>
            <p className="text-gray-700">{celular}</p>
          </div>
          <div>
            <label>Documento</label>
            <p className="text-gray-700">{documento}</p>
          </div>
          <div>
            <label>Empresa</label>
            <p className="text-gray-700">{empresa ? empresa.name : 'Empresa no disponible'}</p>
          </div>
          <div>
            <label>Día de registro</label>
            <p className="text-gray-700">{fechaRegistro}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
