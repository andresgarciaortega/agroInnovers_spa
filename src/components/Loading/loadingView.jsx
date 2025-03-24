import React, { useState, useEffect } from 'react';
import logoImage from "../../assets/imagenes/innover.png"; // Ajusta la ruta para navegar hacia arriba
import loadingImage from "../../assets/imagenes/innover.png"; // Ajusta la ruta para navegar hacia arriba

// Define el componente LoadingView con propiedades predeterminadas
export default function LoadingView({ 
  message = "Por favor, espere mientras cargamos su contenido..." 
}) {
  const [isVisible, setIsVisible] = useState(true);

  // Efecto para alternar la visibilidad de la imagen de carga
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 50000); // Cambia la visibilidad cada 1 segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <div className=" flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="flex flex-col items-center justify-center">
          <img
            src={logoImage}
            alt="Logo"
            className="h-10 mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cargando...
          </h2>
        </div>

        {/* <div className="flex justify-center h-[200px]">
          <img
            src={loadingImage}
            alt="Cargando"
            className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            width={200}
            height={200}
          />
        </div> */}

        <p className="mt-4 text-sm text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
}
