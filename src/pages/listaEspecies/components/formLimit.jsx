// src/components/FormLimit.jsx
import React from 'react';

const FormLimit = ({ parameter, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-1">Variable</label>
        <select
          id="variable"
          name="variable"
          value={parameter.variable}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="">Seleccionar variable</option>
          {/* Add options here */}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minNormal" className="block text-sm font-medium text-gray-700 mb-1">Valor mínimo normal</label>
          <input
            type="text"
            id="minNormal"
            name="minNormal"
            value={parameter.minNormal}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="maxNormal" className="block text-sm font-medium text-gray-700 mb-1">Valor máximo normal</label>
          <input
            type="text"
            id="maxNormal"
            name="maxNormal"
            value={parameter.maxNormal}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minLimit" className="block text-sm font-medium text-gray-700 mb-1">Límite mínimo</label>
          <input
            type="text"
            id="minLimit"
            name="minLimit"
            value={parameter.minLimit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label htmlFor="maxLimit" className="block text-sm font-medium text-gray-700 mb-1">Límite máximo</label>
          <input
            type="text"
            id="maxLimit"
            name="maxLimit"
            value={parameter.maxLimit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="minAlertMessage" className="block text-sm font-medium text-gray-700 mb-1">Mensaje alerta límite mínimo</label>
        <select
          id="minAlertMessage"
          name="minAlertMessage"
          value={parameter.minAlertMessage}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="">Seleccionar mensaje</option>
          {/* Add options here */}
        </select>
      </div>
      <div>
        <label htmlFor="maxAlertMessage" className="block text-sm font-medium text-gray-700 mb-1">Mensaje alerta límite máximo</label>
        <select
          id="maxAlertMessage"
          name="maxAlertMessage"
          value={parameter.maxAlertMessage}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="">Seleccionar mensaje</option>
          {/* Add options here */}
        </select>
      </div>
    </div>
  );
};

export default FormLimit;
