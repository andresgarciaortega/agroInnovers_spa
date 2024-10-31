import React, { useEffect, useState } from 'react';

import { IoCloudUploadOutline } from "react-icons/io5";

const FormVariable = ({ company, mode, closeModal }) => {

  const [enabled, setEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    type: '',
    typeRecord: '',
    calculation: ""
  });

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData(company);
    } else {
      setFormData({
        name: '',
        type: '',
        unit: '',
        typeVariable: '',
        calculation: ''
      });
    }
  }, [company, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      console.log('Añadir variable:', formData);
    } else if (mode === 'edit') {
      console.log('Editar variable:', formData);
    }
    closeModal();
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb- py-">
        <label>Adjuntar Logo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('logo-upload').click()}>
          {formData.logo ? (
            <img src={formData.logo} alt="Company Logo" className="mx-auto h-20 object-contain" />
          ) : (
            <>
              <IoCloudUploadOutline className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                Haga <span className="text-cyan-500 underline">clic aquí</span> para cargar o arrastre y suelte
              </p>
              <p className="text-xs text-gray-500">Archivos máximo 10 mb</p>
            </>
          )}
        </div>
        <input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
      </div>

      <div>
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Nombre variable</label>
        <input
          type="text"
          id="company-name"
          name="name"
          placeholder="Nombre Variable"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidad de medida</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 block w-full border text-gray-400 border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Selecciona una unidad</option>
            <option value="kg">Kilogramos</option>
            <option value="m">Metros</option>
            <option value="l">Litros</option>
            <option value="pcs">Piezas</option>
          </select>
        </div>

        <div>
          <label htmlFor="typerecord" className="block text-sm font-medium text-gray-700">Tipo de registro</label>
          <select
            id="typerecord"
            name="typerecord"
            value={formData.typeRecord}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 text-gray-400 rounded-md p-2"
            required
          >
            <option value="">Selecciona un tipo de registro</option>
            <option value="automatico">Automático</option>
            <option value="manual">Manual</option>
          </select>
        </div>

      </div>

      <div className="mt-5">
        <label htmlFor="Type" className="block text-sm font-medium text-gray-700">Tipo de variable</label>
        <input
          type="text"
          id="Type"
          name="Type"
          placeholder="DireTipo de variable"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="calculation" className="block text-sm font-medium text-gray-700">Cálculo informativo</label>
        <input
          type="text"
          id="calculation"
          name="calculation"
          placeholder="Calculo informativo"
          value={formData.calculation}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      <div className="mt-5 flex items-center">
        <span className="text-sm font-medium text-gray-700 mr-3">Visible en Dashboard</span>
        <div
          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ease-in-out duration-200 ${enabled ? 'bg-[#168C0DFF]' : 'bg-gray-300'
            }`}
          onClick={() => setEnabled(!enabled)}
        >
          <span
            className={`inline-block w-7 h-7 transform bg-white rounded-full transition-transform ease-in-out duration-200 border-2 border-gray-300 shadow-lg  ${enabled ? 'translate-x-5' : 'translate-x-1'
              }`}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {mode === 'view' ? (
          <button
            type="button"
            onClick={closeModal}
            className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
          >
            Volver
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-gray-500 px-4 py-2 rounded border border-gray-400"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="bg-[#168C0DFF] text-white px-4 py-2 rounded"
            >
              {mode === 'create' ? 'Crear Variable' : 'Guardar Cambios'}
              
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default FormVariable;
