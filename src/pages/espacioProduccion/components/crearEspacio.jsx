import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const CrearEspacio = () => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <form className="p-6">
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Crear Lista de Especies</h2>

          {/* Steps Header */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${step === 0 ? 'text-black font-bold' : 'text-gray-500'} flex items-center`}>
                1. Creación de Parámetros de Producción
                {step > 0 && <FaCheckCircle className="text-[#168C0DFF] ml-2" />}
              </div>
              <div className={`${step === 1 ? 'text-black font-bold' : 'text-gray-500'} flex items-center`}>
                2. Parámetros por Etapa
                {step > 1 && <FaCheckCircle className="text-[#168C0DFF] ml-2" />}
              </div>
              <div className={`${step === 2 ? 'text-black font-bold' : 'text-gray-500'}`}>
                3. Revisión y Confirmación
              </div>
            </div>

            {/* Steps Progress Bar */}
            <div className="flex items-center mb-6">
              <div className="flex-grow h-1 bg-gray-300 relative">
                <div
                  className={`h-1 bg-[#168C0DFF]`}
                  style={{ width: `${(step + 1) * (100 / 3)}%` }}
                ></div>
                <div className="absolute inset-0 flex justify-between">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1 bg-white rounded-full border ${
                        step >= index ? 'border-[#168C0DFF]' : 'border-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre científico
                  </label>
                  <input
                    type="text"
                    id="scientificName"
                    name="scientificName"
                    placeholder="Nombre científico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                    Parámetros por etapa
                  </label>
                  <input
                    type="text"
                    id="stage"
                    name="stage"
                    placeholder="Detalles de la etapa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#168C0DFF] focus:border-[#168C0DFF]"
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Revisión Final</h3>
                <p className="text-gray-700">Por favor revisa todos los datos antes de finalizar.</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Anterior
              </button>
            )}
            {step < 2 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Siguiente
              </button>
            )}
            {step === 2 && (
              <button
                type="button"
                onClick={() => alert('Formulario finalizado')}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#137B09FF] text-white hover:bg-[#168C0DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#168C0DFF]"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CrearEspacio;
