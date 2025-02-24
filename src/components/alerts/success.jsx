import React from 'react';
import { CheckCircle } from 'lucide-react'; // Asegúrate de tener este ícono o el que prefieras

const SuccessAlert = ({ message, onCancel, onConfirm, confirmText = 'Aceptar' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 text-center relative">
        <button onClick={onCancel} className="absolute top-2 right-2 bg-transparent border-none cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500 hover:text-gray-800" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center justify-center py-5">
          <CheckCircle className="w-20 h-12 text-green-600 mb-5" /> {/* Cambia el color aquí */}
          <h3 className="text-lg font-semibold text-black mb-2">{message}</h3>
        </div>
        <div className="flex justify-end gap-2">
          {/* <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button> */}
          {onConfirm && (
            <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
