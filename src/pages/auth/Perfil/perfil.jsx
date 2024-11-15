import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Phone, Briefcase, Calendar, CreditCard, ArrowLeftCircle, Lock } from "lucide-react";


import { useNavigate } from "react-router-dom";
import { getDecodedToken } from '../../../utils/auseAuth'; 

export default function Perfil() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); 

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

  const handleEdit = () => {
    if (isEditing) {
     
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-100 dark:to-gray-200 rounded-xl shadow-lg relative">
      <button
          onClick={goHome}
          className="absolute top-4 right-4 p-2 bg-transparent border-0 text-gray-600 hover:text-gray-800"
          aria-label="Salir"
        >
          <ArrowLeftCircle className="h-6 w-6" />
        </button>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary shadow-xl">
            <img
              alt="Foto de perfil"
              className="object-cover w-full h-full"
              height="160"
              src={fotoFondo}
              width="160"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="text-3xl font-bold mb-2 p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <h1 className="text-3xl font-bold mb-2">{nombre}</h1>
            )}
            <p className="text-gray-600 my-2">{roles && roles.length > 0 ? roles[0].name : 'Rol no disponible'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem
                icon={<Mail className="w-5 h-5" />}
                label="Correo"
                value={correo}
              />
              <ProfileItem
                icon={<Lock className="w-5 h-5" />}
                label="Contraseña"
                value={
                  isEditing ? (
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="max-w-[200px] p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    showPassword ? password : "••••••••••"
                  )
                }
                action={
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <ProfileItem icon={<Phone className="w-5 h-5" />} label="Celular" value={celular} />
              <ProfileItem icon={<CreditCard className="w-5 h-5" />} label="Documento" value={documento} />
              <ProfileItem icon={<Briefcase className="w-5 h-5" />} label="Empresa" value={empresa ? empresa.name : "N/A"} />
              <ProfileItem icon={<Calendar className="w-5 h-5" />} label="Fecha de Registro" value={fechaRegistro} />
            </div>
          </div>
        </div>
        <div className="my-8 border-t border-gray-300" />
        <div className="flex justify-end">
          <button
            onClick={handleEdit}
            className="bg-[#168C0DFF] text-white p-2 rounded-md hover:bg-blue-600"
          >
            {isEditing ? "Guardar Cambios" : "Editar Perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value, action }) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm text-gray-600 flex-grow">{value}</span>
      {action}
    </div>
  );
}
