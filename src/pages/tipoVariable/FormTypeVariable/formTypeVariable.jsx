import React, { useEffect, useState } from 'react';

import { IoCloudUploadOutline } from "react-icons/io5";

const FormTypeVariable = ({ company, mode, closeModal }) => {

  const [enabled, setEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
  });


  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData(company);
      setImagePreview(company.icon);
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
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

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let iconUrl = '';

      if (formData.icon) {
        // Sube el archivo a S3 y asigna la URL
        iconUrl = await UploadToS3(formData.icon);
      }

      const formDataToSubmit = {
        ...formData,
        icon: iconUrl, // Asigna la URL del icono
      };

      // Llamada al servicio según el modo
      if (mode === 'create') {
        // Código para crear la entidad
        console.log("Entidad creada:", formDataToSubmit);
      } else if (mode === 'edit') {
        // Código para actualizar la entidad
        console.log("Entidad actualizada:", formDataToSubmit);
      }

      closeModal();
    } catch (error) {
      console.error('Error al guardar la entidad:', error);
    }
  };
  
  
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen
  
    // const handleLogoUpload = (e) => {
    //   const file = e.target.files[0]; // Obtener el primer archivo seleccionado
    //   if (file) {
    //     setFormData({
    //       ...formData,
    //       logo: file, // Almacenar el objeto File
    //     });
    
    //     // Crear un lector de archivos para la visualización
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setImagePreview(reader.result); // Almacenar la representación en base64 para la vista previa
    //     };
    
    //     reader.readAsDataURL(file); // Leer el archivo como base64
    //   }
    // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div className="mb-4">
        <label>Adjuntar Icono</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 text-center cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById('icon-upload').click()}>
          {imagePreview ? (
            <img src={imagePreview} alt="Icono" className="mx-auto h-20 object-contain" />
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
        <input id="icon-upload" type="file" className="hidden" onChange={handleIconUpload} accept="image/*" />
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
                value={formData.description}
          onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Descripción del tipo de variable"
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
