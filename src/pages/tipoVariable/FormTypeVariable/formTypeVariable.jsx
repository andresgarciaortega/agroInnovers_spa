import React, { useEffect, useState } from 'react';

import { IoCloudUploadOutline } from "react-icons/io5";

import UploadToS3 from '../../../config/UploadToS3';

import VariableTypeService from '../../../services/VariableType';

const FormTypeVariable = ({ showErrorAlert, onUpdate, typevariable, mode, closeModal }) => {

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
  });

  const [showAlertError, setShowAlertError] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");


  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData(typevariable);
      setImagePreview(typevariable.icon);
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
      });
    }
  }, [typevariable, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
        const createTypeVariable = await VariableTypeService.createTypeVariable(formDataToSubmit);
        showErrorAlert("creada")
      } else if (mode === 'edit') {
        showErrorAlert("Editada")
        const updatedCompany = await VariableTypeService.updateTypeVariable(typevariable.id, formDataToSubmit);
      }

      onUpdate();

      closeModal();
    } catch (error) {
      console.error("Error:", error);
      setMessageAlert("Hubo un error al guardar.");
      setShowAlertError(true);
    }
  };

  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen


  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        icon: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


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
        <label htmlFor="typevariable-name" className="block text-sm font-medium text-gray-700">Nombre variable</label>
        <input
          type="text"
          id="typevariable-name"
          name="name"
          placeholder="Nombre Variable"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
          readOnly={mode === 'view'}
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
          readOnly={mode === 'view'}
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
