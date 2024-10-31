import React, { useEffect, useState } from 'react';

import { IoCloudUploadOutline } from "react-icons/io5";

const FormTypeVariable = ({ company, mode, closeModal }) => {

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
      <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value=""
                onChange="{handleInputChange}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Descripción de la especie"
              ></textarea>
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

export default FormTypeVariable;
